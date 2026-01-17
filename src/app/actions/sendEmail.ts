"use server";

export async function sendEmail(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Basic validation
    if (!name || !email || !message) {
        return { success: false, error: "Missing fields" };
    }

    try {
        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        console.log("Debug Env Vars:");
        console.log("GMAIL_USER:", process.env.GMAIL_USER ? "Set" : "Missing");
        console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "Set" : "Missing");

        const mailOptions = {
            from: `"${name}" <${process.env.GMAIL_USER}>`, // Authenticated sender
            to: process.env.GMAIL_USER, // User's email
            replyTo: email, // Visitor's email
            subject: `New Message from ${name} (Portfolio)`,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #000;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };

    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: "Failed to send email" };
    }
}
