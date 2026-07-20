import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const clinicContext = `आप Vasu Hair Transplant Clinic के एक बेहद स्मार्ट, मददगार और प्रोफेशनल AI असिस्टेंट हैं।

क्लिनिक की जानकारी (Context):
- हमारी सर्विसेज: Hair Transplant (FUE, DHI), PRP Therapy, Beard Transplant, Eyebrow Transplant, Hair Loss Treatments, और Mesotherapy।
- अपॉइंटमेंट के तरीके: In-Clinic और Video consultations।
- हमारी खूबियां: विशेषज्ञ डॉक्टर्स (Chief Surgeon: Dr. Vasu Koshle), हाई क्वालिटी रिज़ल्ट्स।
- क्लिनिक रायपुर में 5000+ खुश ग्राहकों के साथ No.1 क्लिनिक है।

जवाब देने के नियम (SYSTEM INSTRUCTIONS):
- LANGUAGE MATCHING: ग्राहक जिस भाषा में सवाल पूछे, उसी भाषा में जवाब दें। अगर ग्राहक हिंदी में पूछे तो हिंदी में, English में पूछे तो English में, और Hinglish में पूछे तो Hinglish में ही जवाब दें।
- SHORT & SMART ANSWERS: सवालों के जवाब स्मार्ट तरीके से दें। ज्यादा लंबे जवाब न दें।
- CONVINCING: पेशेंट को अपॉइंटमेंट बुक करने के लिए कनविंस करें।
- CLOSING: किसी भी सवाल के जवाब के अंत में हमेशा पूछें "क्या आपका कोई और सवाल है? नहीं तो अगर आप अपॉइंटमेंट बुक करना चाहते हैं तो बताएं, मैं बुकिंग फॉर्म दे देता हूँ।"
- PROFESSIONAL TONE: बहुत प्रोफेशनल तरीके से बात करें, cheap तरीके से जवाब न दें।
- URGENCY: अगर मरीज़ को ज़्यादा प्रॉब्लम है, तो पेशेंट को बोलें कि "आप तुरंत अभी अपॉइंटमेंट बुक कर लें और क्लिनिक को विज़िट करें।"
- DYNAMIC CONTENT: एडमिन पैनल के डेटाबेस (websiteContext) में क्लिनिक के बारे में जो टेक्स्ट लिखा है, उसे भी पढ़ कर जवाब दें।
- सिर्फ क्लिनिक और इससे जुड़ी जानकारी दें, बाकि सभी AI चैटबॉट के फीचर्स डिफ़ॉल्ट सेट रखें।`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history = [], apiKey, websiteContext } = req.body;

    const contents = history.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    let currentAi = ai;
    if (apiKey) {
      currentAi = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }

    let finalContext = clinicContext;
    finalContext += `\n\nमहत्वपूर्ण बुकिंग निर्देश:
अगर यूज़र अपॉइंटमेंट लेना चाहता है (जैसे "I want to book appointment", "अपॉइंटमेंट बुक करें", "book", "yes book it" आदि), तो उनसे जानकारी मांगने के बजाय सीधे 'show_booking_form' टूल को कॉल करें। यह टूल चैट में एक छोटा सा फॉर्म खोल देगा जिससे वे अपनी जानकारी भर सकेंगे।`;

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

    const response = await currentAi.models.generateContent({
      model: "gemini-2.5-flash",
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
    if (error?.status === 429 || error?.message?.includes('Quota exceeded') || error?.message?.includes('429')) {
      return res.status(429).json({ error: "API limit reached. Please try again in a few minutes." });
    }
    res.status(500).json({ error: "Sorry, there was an error processing your request." });
  }
}
