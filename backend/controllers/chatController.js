const { GoogleGenerativeAI } = require('@google/generative-ai');

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

async function chat(req, res) {
  const { message, language = 'en' } = req.body || {};
  const userMessage = String(message || '').trim();
  if (!userMessage) return res.status(400).json({ message: 'message is required' });

  const lng = ['en', 'hi', 'mr'].includes(language) ? language : 'en';

  const systemPrompts = {
    en: 'You are a friendly women’s health assistant focused on PCOS. Answer clearly in English, in 3–6 short paragraphs or bullet points. Avoid giving medical diagnosis; encourage consulting a gynecologist for serious concerns.',
    hi: 'आप पीसीओएस पर केंद्रित एक दोस्ताना महिलाओं के स्वास्थ्य सहायक हैं। 3–6 छोटे पैराग्राफ या बुलेट पॉइंट में सरल हिंदी में जवाब दें। कोई मेडिकल डायग्नोसिस न दें, ज़रूरत होने पर स्त्री रोग विशेषज्ञ से मिलने के लिए प्रेरित करें।',
    mr: 'तुम्ही पीसीओएसवर लक्ष केंद्रित केलेले मैत्रीपूर्ण महिलांचे आरोग्य सहाय्यक आहात. 3–6 लहान परिच्छेद किंवा बुलेट पॉइंटमध्ये सोप्या मराठीत उत्तर द्या. वैद्यकीय निदान देऊ नका; गरज असल्यास स्त्रीरोगतज्ज्ञांचा सल्ला घेण्यास प्रोत्साहित करा.',
  };

  const client = getClient();

  // If no API key, return a safe fallback message but still different per language.
  if (!client) {
    return res.json({
      answer:
        lng === 'hi'
          ? 'फिलहाल एआई चैट के लिए बाहरी एपीआई कॉन्फ़िग नहीं है, लेकिन आप पीसीओएस, डाइट, व्यायाम, नींद या डॉक्टर से जुड़ी जानकारी के लिए मुख्य स्क्रीन और आकलन परिणाम देख सकती हैं। एडमिन OPENAI_API_KEY सेट करने के बाद अधिक स्मार्ट जवाब सक्रिय कर सकते हैं।'
          : lng === 'mr'
            ? 'सध्या एआय चॅटसाठी बाह्य API कॉन्फिग नाही, पण पीसीओएस, डाएट, व्यायाम, झोप किंवा डॉक्टरांविषयी मूलभूत माहिती स्क्रीन व परिणामांमध्ये पाहू शकता. अॅडमिन OPENAI_API_KEY सेट केल्यावर अधिक स्मार्ट उत्तरे सक्रिय करू शकतात.'
            : 'AI chat is in demo mode because no OPENAI_API_KEY is configured on the server. You can still use the assessment, diet plan, and reminders. Once the key is added to the backend, the assistant will give richer, more accurate answers.',
    });
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Construct prompt
    const prompt = `${systemPrompts[lng]}\n\nUser: ${userMessage}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();
    
    return res.json({ answer });
  } catch (err) {
    console.error('Chat API failed', err);
    return res.status(500).json({ message: 'Chat service unavailable' });
  }
}

module.exports = { chat };

