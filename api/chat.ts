import { GoogleGenAI } from "@google/genai";

const clinicContext = `आप Vasu Hair Transplant Clinic के एक बेहद स्मार्ट, मददगार और कंविनसिंग (convincing) AI असिस्टेंट हैं।
आपका मुख्य काम है:
1. ग्राहक के सवालों का बहुत ही अच्छे से, सटीक और आसान हिंदी में जवाब देना।
2. ग्राहकों को क्लिनिक की खूबियां बताना और उन्हें अपॉइंटमेंट बुक (Book Appointment) करने के लिए प्रेरित करना।

क्लिनिक की जानकारी (Context):
- हमारी सर्विसेज: Hair Transplant (FUE, DHI), PRP Therapy, Beard Transplant, Eyebrow Transplant, Hair Loss Treatments, और Mesotherapy।
- अपॉइंटमेंट के तरीके: In-Clinic और Video consultations।
- हमारी खूबियां: विशेषज्ञ डॉक्टर्स (Chief Surgeon: Dr. Vasu Koshle), हाई क्वालिटी रिज़ल्ट्स, और खुश ग्राहकों के रिव्यू।
- क्लिनिक रायपुर में 5000+ खुश ग्राहकों के साथ No.1 क्लिनिक है।

जवाब देने के नियम:
- जवाब हमेशा हिंदी (Devanagari script) में दें।
- बातचीत को बहुत ही विनम्र, पेशेवर, और आकर्षक (engaging) रखें।
- ग्राहक के सवाल का सही जवाब देने के बाद, हर जवाब के अंत में बहुत ही नैचुरली (naturally) उन्हें अपॉइंटमेंट बुक करने के लिए प्रेरित करें। उदाहरण: "अधिक जानकारी के लिए, कृपया अपना फ्री अपॉइंटमेंट बुक करें।" या "मैं आपको एक बार क्लिनिक में आकर डॉक्टर वासु कोसले (Dr. Vasu Koshle) से मिलने की सलाह दूंगा, कृपया अपॉइंटमेंट बुक करें।"
- अगर कोई सवाल क्लिनिक या हेयर ट्रांसप्लांट से संबंधित नहीं है, तो विनम्रता से मना कर दें।
- जो भी डायनेमिक कंटेंट (websiteContext) आपको मिले, उसका इस्तेमाल सवालों के जवाब देने के लिए करें।`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [], apiKey, websiteContext } = req.body;
    
    const contents = history.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });
    
    const activeApiKey = apiKey || process.env.GEMINI_API_KEY;
    
    if (!activeApiKey) {
      return res.status(500).json({ error: "API key is missing. Please configure GEMINI_API_KEY in Vercel environment variables." });
    }

    const ai = new GoogleGenAI({
      apiKey: activeApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    
    let finalContext = clinicContext;
    if (websiteContext) {
      finalContext += "\n\nHere is the current dynamic website content:\n" + websiteContext;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: finalContext,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Sorry, there was an error processing your request." });
  }
}
