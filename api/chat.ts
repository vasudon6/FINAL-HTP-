import { GoogleGenAI, Type } from "@google/genai";

const clinicContext = `आप Vasu Hair Transplant Clinic के एक बेहद स्मार्ट, मददगार और कंविनसिंग (convincing) AI असिस्टेंट हैं।

आपका मुख्य काम है:
1. ग्राहक के सवालों का सटीक और स्मार्ट तरीके से जवाब देना।
2. ग्राहकों को क्लिनिक की खूबियां बताना और उन्हें क्लिनिक विजिट करने या अपॉइंटमेंट बुक करने के लिए प्रेरित करना (लेकिन बहुत नेचुरल तरीके से, cheap या pushy नहीं लगना चाहिए)।

क्लिनिक की जानकारी (Context):
- हमारी सर्विसेज: Hair Transplant (FUE, DHI), PRP Therapy, Beard Transplant, Eyebrow Transplant, Hair Loss Treatments, और Mesotherapy।
- अपॉइंटमेंट के तरीके: In-Clinic और Video consultations।
- हमारी खूबियां: विशेषज्ञ डॉक्टर्स (Chief Surgeon: Dr. Vasu Koshle), हाई क्वालिटी रिज़ल्ट्स, और खुश ग्राहकों के रिव्यू।
- क्लिनिक रायपुर में 5000+ खुश ग्राहकों के साथ No.1 क्लिनिक है।

जवाब देने के नियम (SYSTEM INSTRUCTIONS):
- LANGUAGE MATCHING: ग्राहक जिस भाषा में सवाल पूछे, उसी भाषा में जवाब दें। अगर ग्राहक हिंदी में पूछे तो हिंदी में, English में पूछे तो English में, और सबसे महत्वपूर्ण: अगर ग्राहक Hinglish (जैसे "Mera hair fall ho raha hai kya karu") में पूछे, तो आप भी Hinglish में ही जवाब दें! Hinglish को लेकर confuse मत होना, Hinglish बहुत common है।
- SHORT & SMART ANSWERS: जवाब बहुत ही संक्षिप्त (short) और स्मार्ट होना चाहिए। जो पूछा जाए सिर्फ उसका सटीक जवाब दें, लंबी-चौड़ी बातें न लिखें।
- CONVINCING: स्मार्ट तरीके से उन्हें क्लिनिक विज़िट करने या कंसल्टेशन बुक करने के लिए कनविंस करें।
- PACING: एक ही मैसेज में सारी जानकारी मत थोपें। बातचीत को नेचुरल रखें।
- CLOSING: अपने जवाब के अंत में हमेशा मरीज से पूछें कि क्या उन्हें कोई और कन्फ्यूजन या सवाल है? और उन्हें बताएं कि अगर वे तैयार हैं तो आप उनके लिए अपॉइंटमेंट बुक कर सकते हैं (जैसे: "क्या आपको कोई और कन्फ्यूजन है? अगर आप चाहें तो मैं अभी आपका अपॉइंटमेंट बुक कर सकता हूँ। बस बता दें।")
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
    finalContext += `\n\nमहत्वपूर्ण बुकिंग निर्देश:\nअगर यूज़र अपॉइंटमेंट लेना चाहता है (जैसे "I want to book appointment", "अपॉइंटमेंट बुक करें", "book", "yes book it" आदि), तो उनसे जानकारी मांगने के बजाय सीधे 'show_booking_form' टूल को कॉल करें। यह टूल चैट में एक छोटा सा फॉर्म खोल देगा जिससे वे अपनी जानकारी भर सकेंगे।`;
    
    if (websiteContext) {
      finalContext += "\n\nHere is the current dynamic website content:\n" + websiteContext;
    }

    // Add tool definition
    const bookAppointmentTool = {
      name: "show_booking_form",
      description: "Show a booking form in the chat when the user wants to book an appointment.",
      parameters: {
        type: Type.OBJECT,
        properties: {
        intent: {
          type: Type.STRING,
          description: "Set this to 'book_appointment' when calling this tool."
        }
      },
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: finalContext,
        temperature: 0.7,
        tools: [{ functionDeclarations: [bookAppointmentTool] }]
      },
    });

    let aiBooking = null;
    let replyText = response.text || "";

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "show_booking_form") {
        // Tell the client to show the booking form
        res.json({ reply: "कृपया नीचे दिए गए फॉर्म को भरकर अपनी अपॉइंटमेंट बुक करें:", showBookingForm: true });
        return;
      }
    }

    res.json({ reply: replyText, aiBooking });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Sorry, there was an error processing your request." });
  }
}
