const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generate7DayDietPlan(params) {
  const { riskLevel, language = 'en', bmi, lifestyle, symptoms } = params;

  if (!process.env.GEMINI_API_KEY) {
    // Fallback if no API key is provided
    return getFallbackDietPlan(riskLevel, language);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a professional nutritionist expert in PCOS management.
    Generate a 7-day diet plan avoiding allergens, highly processed foods, and high glycemic index items.
    
    User details:
    - PCOS Risk Level: ${riskLevel}
    - BMI: ${bmi || 'Not specified'}
    - Lifestyle Activity: ${lifestyle?.exerciseFrequency || 'Not specified'}
    - Key Symptoms: ${JSON.stringify(symptoms || {})}
    
    The response must strictly be a JSON object with the following structure:
    {
      "language": "${language}",
      "riskLevel": "${riskLevel}",
      "days": [
        {
          "dayLabel": "Monday",
          "breakfast": "Meal description...",
          "lunch": "Meal description...",
          "dinner": "Meal description...",
          "snacks": "Meal description..."
        },
        ... (generate for all 7 days)
      ]
    }
    
    Return ONLY valid JSON and no codeblocks. Do not include markdown \`\`\`json wrappers. Translate the 'dayLabel' to ${language} if it is not English.
  `;

  try {
    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    }
    const plan = JSON.parse(rawText);
    return plan;
  } catch (error) {
    console.error('Gemini Diet Generation Error:', error);
    return getFallbackDietPlan(riskLevel, language);
  }
}

function getFallbackDietPlan(riskLevel, language) {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const base = [
    { breakfast: 'Oatmeal with berries', lunch: 'Grilled chicken salad', dinner: 'Quinoa bowl with veggies' },
    { breakfast: 'Smoothie bowl', lunch: 'Lentil soup with whole grain bread', dinner: 'Baked salmon with vegetables' },
    { breakfast: 'Whole grain toast with avocado', lunch: 'Chickpea curry', dinner: 'Stir-fry tofu with brown rice' },
    { breakfast: 'Greek yogurt parfait', lunch: 'Brown rice with dal', dinner: 'Grilled fish with salad' },
    { breakfast: 'Chia pudding', lunch: 'Vegetable wrap', dinner: 'Paneer tikka with millet' },
    { breakfast: 'Poha with nuts', lunch: 'Rajma chawal (brown rice)', dinner: 'Mixed vegetable soup' },
    { breakfast: 'Idli with sambar', lunch: 'Chole salad', dinner: 'Light khichdi' },
  ];

  let snacks = 'Seasonal fruit';
  if (riskLevel === 'High') snacks = 'Roasted chana or a handful of nuts; unsweetened herbal tea';
  if (riskLevel === 'Moderate') snacks = 'Fruit + yogurt or sprouts chaat';

  const mapHi = { Monday:'सोमवार', Tuesday:'मंगलवार', Wednesday:'बुधवार', Thursday:'गुरुवार', Friday:'शुक्रवार', Saturday:'शनिवार', Sunday:'रविवार'};
  
  return {
    language,
    riskLevel,
    days: week.map((day, idx) => ({
      dayLabel: language === 'hi' ? mapHi[day] : day,
      breakfast: base[idx].breakfast,
      lunch: base[idx].lunch,
      dinner: base[idx].dinner,
      snacks: snacks
    }))
  };
}

module.exports = { generate7DayDietPlan };
