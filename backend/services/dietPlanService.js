function pickByRisk(riskLevel) {
  const base = [
    { breakfast: 'Oatmeal with berries', lunch: 'Grilled chicken salad', dinner: 'Quinoa bowl with veggies' },
    { breakfast: 'Smoothie bowl', lunch: 'Lentil soup with whole grain bread', dinner: 'Baked salmon with vegetables' },
    { breakfast: 'Whole grain toast with avocado', lunch: 'Chickpea curry', dinner: 'Stir-fry tofu with brown rice' },
    { breakfast: 'Greek yogurt parfait', lunch: 'Brown rice with dal', dinner: 'Grilled fish with salad' },
    { breakfast: 'Chia pudding', lunch: 'Vegetable wrap', dinner: 'Paneer tikka with millet' },
    { breakfast: 'Poha with nuts', lunch: 'Rajma chawal (brown rice)', dinner: 'Mixed vegetable soup' },
    { breakfast: 'Idli with sambar', lunch: 'Chole salad', dinner: 'Light khichdi' },
  ];

  if (riskLevel === 'High') {
    return base.map((d) => ({
      ...d,
      snacks: 'Roasted chana or a handful of nuts; unsweetened herbal tea',
    }));
  }
  if (riskLevel === 'Moderate') {
    return base.map((d) => ({
      ...d,
      snacks: 'Fruit + yogurt or sprouts chaat',
    }));
  }
  return base.map((d) => ({ ...d, snacks: 'Seasonal fruit' }));
}

function translatePlan(daysEn, lang) {
  if (lang === 'en') return daysEn;

  // Hackathon-ready prototype translations (lightweight, readable)
  const mapHi = {
    Monday: 'सोमवार',
    Tuesday: 'मंगलवार',
    Wednesday: 'बुधवार',
    Thursday: 'गुरुवार',
    Friday: 'शुक्रवार',
    Saturday: 'शनिवार',
    Sunday: 'रविवार',
    breakfast: 'नाश्ता',
    lunch: 'दोपहर का भोजन',
    dinner: 'रात का भोजन',
    snacks: 'स्नैक्स',
  };
  const mapMr = {
    Monday: 'सोमवार',
    Tuesday: 'मंगळवार',
    Wednesday: 'बुधवार',
    Thursday: 'गुरुवार',
    Friday: 'शुक्रवार',
    Saturday: 'शनिवार',
    Sunday: 'रविवार',
    breakfast: 'नाश्ता',
    lunch: 'दुपारचे जेवण',
    dinner: 'रात्रीचे जेवण',
    snacks: 'स्नॅक्स',
  };

  const map = lang === 'hi' ? mapHi : mapMr;
  // Keep meal names in English for clarity (can be expanded later)
  return daysEn.map((d) => ({ ...d, dayLabel: map[d.day] || d.day }));
}

function generate7DayDietPlan({ riskLevel, language = 'en' }) {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const base = pickByRisk(riskLevel);
  const daysEn = week.map((day, idx) => ({ day, ...base[idx] }));
  const days = translatePlan(daysEn, language);
  return {
    language,
    riskLevel,
    days,
  };
}

module.exports = { generate7DayDietPlan };

