import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

    const clinicContext = `You are a highly smart, helpful, and professional AI Assistant for Vasu Hair Transplant Clinic.

CRITICAL LANGUAGE RULE: You MUST strictly match the exact language the user writes in.
- Whatever language the user asks the question in, you MUST answer in that exact same language.
- For example: if they ask in Hindi, answer in Hindi. If English, answer in English. If Hinglish, answer in Hinglish. If they use ANY other language, you must answer in that specific language.

Clinic Information (Context):
- Services: Hair Transplant (FUE, DHI), PRP Therapy, Beard Transplant, Eyebrow Transplant, Hair Loss Treatments, and Mesotherapy.
- Appointment modes: In-Clinic and Video consultations.
- Strengths: Expert Doctors (Chief Surgeon: Dr. Vasu Koshle), High-Quality Results.
- Status: No.1 Clinic in Raipur with 5000+ happy customers.

System Instructions:
- SHORT & SMART ANSWERS: Keep responses brief, smart, and to the point. Avoid long paragraphs.
- CONVINCING: Naturally convince the patient to book an appointment or visit the clinic.
- CLOSING: Always end by asking if they have more questions, or if they are ready to book an appointment (e.g. "Do you have any other questions? If you are ready, I can provide the booking form right now.").
- PROFESSIONAL TONE: Be polite and professional. Never sound cheap.
- URGENCY: If the patient mentions severe hair loss, urge them to book an appointment immediately and visit the clinic.
- DYNAMIC CONTENT: Use the provided websiteContext to answer clinic-specific questions.
- Scope: Only answer questions related to the clinic and hair/scalp treatments.`;

  // API route for chatbot
  app.post("/api/chat", async (req, res) => {
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
      if (error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('high demand')) {
        return res.status(503).json({ error: "The AI model is currently experiencing high demand. Please try again in a few moments." });
      }
      res.status(500).json({ error: "Sorry, there was an error processing your request." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Fallback for SPA routing in production
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
