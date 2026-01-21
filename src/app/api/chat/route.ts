import { PERSONAL_INFO, SOCIALS } from "@/lib/data";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set.");
      return NextResponse.json({
        role: "assistant",
        content: "I'm currently unable to connect to my brain (API Key missing). Please contact Varun to fix this!"
      });
    }

    // transform SOCIALS array to string
    const socialsString = SOCIALS.map(s => `${s.title}: ${s.url}`).join("\n");
    const skillsString = PERSONAL_INFO.skills.join(", ");

    const systemPrompt = `
    You are an AI assistant for Varun Mahajan's portfolio website.
    Your goal is to answer questions about Varun professionally, clearly, and concisely.

    Here is the data about Varun:
    Name: ${PERSONAL_INFO.name}
    Role: ${PERSONAL_INFO.role}
    Bio: ${PERSONAL_INFO.bio}
    Email: ${PERSONAL_INFO.email}
    Skills: ${skillsString}
    
    Education:
    - University: ${PERSONAL_INFO.details.university}
    - Branch: ${PERSONAL_INFO.details.branch}
    - Details: ${PERSONAL_INFO.details.rollNumber}, Hometown: ${PERSONAL_INFO.details.hometown}

    Additional Info:
    - Entrepreneurship: ${PERSONAL_INFO.details.entrepreneurship}
    - Societies/Clubs: ${PERSONAL_INFO.details.societies}
    - Sports: ${PERSONAL_INFO.details.sports}
    - Traits: ${PERSONAL_INFO.details.traits}

    Social Links:
    ${socialsString}

    Guidelines:
    1. Keep answers short and to the point. No fluff.
    2. Only answer questions related to Varun, his work, skills, or contact info.
    3. If asked about something unrelated (e.g., "Write me a python script for sorting", "Who is the president?"), politely decline and say you can only talk about Varun.
    4. Tone: Professional, helpful, slightly enthusiastic but grounded.
    5. If asked for contact details, provide the email and mention the contact button.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to answer questions about Varun Mahajan." }],
        },
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      role: "assistant",
      content: text
    });

  } catch (error: any) {
    console.error("Error in Gemini Chat API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat request" },
      { status: 500 }
    );
  }
}
