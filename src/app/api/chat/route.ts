import { PERSONAL_INFO, SOCIALS } from "@/lib/data";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    console.log("Chat API called (Local mode). Query:", lastMessage);

    const responseText = findBestMatch(lastMessage);

    return NextResponse.json({
      role: "assistant",
      content: responseText
    });

  } catch (error: any) {
    console.error("Error in Local Chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

function findBestMatch(query: string): string {
  const q = query.toLowerCase();

  // 1. Identity / Bio
  if (q.includes("who") || q.includes("name") || q.includes("about") || q.includes("introduce")) {
    return `I am ${PERSONAL_INFO.name}, a ${PERSONAL_INFO.role}. ${PERSONAL_INFO.bio}`;
  }

  // 2. Skills / Tech Stack
  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("code")) {
    return `My technical skills include: ${PERSONAL_INFO.skills.join(", ")}. I am also currently exploring C, C++, and Web Development.`;
  }

  // 3. Contact / Email
  if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("hire") || q.includes("gmail")) {
    return `You can reach me at: ${PERSONAL_INFO.email}. feel free to send me a message using the "Let's Talk" button above!`;
  }

  // 4. Projects / Work
  if (q.includes("project") || q.includes("work") || q.includes("portfolio") || q.includes("build")) {
    return `I have worked on several projects, including Neon Nexus (Cyberpunk E-commerce), Aether Lens (Photography), and Orbital Dash (WebGL Game). Check out the "Connect" section for my latest work!`;
  }

  // 5. Socials / Links
  if (q.includes("social") || q.includes("link") || q.includes("github") || q.includes("linkedin") || q.includes("instagram")) {
    const links = SOCIALS.map(s => `${s.title}: ${s.url}`).join("\n");
    return `Here are my social profiles:\n${links}`;
  }

  // 6. Education / University
  if (q.includes("university") || q.includes("college") || q.includes("study") || q.includes("degree") || q.includes("thapar")) {
    // Safe access to loosely typed details if needed, or just use the known structure from data.ts
    return `I am studying Computer Engineering (COE) at Thapar Institute of Engineering & Technology (Roll No: 1025030117).`;
  }

  // 7. General / Hello
  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return `Hello! I'm Varun's AI assistant. Ask me about my skills, projects, or how to contact me.`;
  }

  // Default Fallback
  return "I'm a simple portfolio assistant tailored to answer questions about Varun Mahajan. Try asking about my 'skills', 'projects', 'contact info', or 'education'.";
}
