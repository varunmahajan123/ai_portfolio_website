"use server";

export async function sendEmail(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Basic validation
    if (!name || !email || !message) {
        return { success: false, error: "Missing fields" };
    }

    // TODO: Integrate actual SMTP like Nodemailer or Resend
    console.log("--- MOCK EMAIL SENT ---");
    console.log("From:", name, email);
    console.log("Message:", message);
    console.log("-----------------------");

    return { success: true };
}
