# How to Create a Gmail App Password

Since you are using 2-Step Verification (which is required for Gmail security), you cannot use your regular password. You need an **App Password**.

## Step 1: Enable 2-Step Verification
1. Go to your [Google Account Security page](https://myaccount.google.com/security).
2. Under "How you sign in to Google", ensure **2-Step Verification** is **ON**.
   - If it is OFF, click it and follow the steps to enable it (setup phone number/prompts).

## Step 2: Generate App Password
1. Once 2-Step Verification is ON, go back to the [Security page](https://myaccount.google.com/security).
2. Search for **"App passwords"** in the search bar at the top, or click this direct link: [App Passwords](https://myaccount.google.com/apppasswords).
   - *Note: If you don't see this option, 2-Step Verification might not be fully active yet.*
3. You may be asked to sign in again.
4. **App name**: Type "Portfolio" (or any name).
5. Click **Create**.

## Step 3: Use the Password
1. Google will show you a **16-character code** in a yellow bar (e.g., `xxxx xxxx xxxx xxxx`).
2. **Copy this code**.
3. Open your `.env.local` file in your project.
4. Paste the code next to `GMAIL_PASS=`.
   - Example: `GMAIL_PASS=abcd efgh ijkl mnop`
   - (Spaces are fine, or you can remove them).
5. **Save the file**.

## Step 4: Restart Server
1. Stop your running server (Ctrl+C).
2. Run `npm run dev` again.
3. Test the contact form.
