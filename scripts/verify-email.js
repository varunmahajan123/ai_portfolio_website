const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Read .env.local
        const envPath = path.join(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local file not found');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[key] = value;
            }
        });

        const user = envVars.GMAIL_USER;
        const pass = envVars.GMAIL_PASS;

        if (!user || !pass) {
            console.error('❌ Missing GMAIL_USER or GMAIL_PASS in .env.local');
            return;
        }

        console.log(`Checking configuration for user: ${user}`);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });

        console.log('Attempting to verify connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('Attempting to send test email...');
        await transporter.sendMail({
            from: user,
            to: user,
            subject: 'Test Email from Debug Script',
            text: 'If you receive this, your email configuration works!',
        });
        console.log('✅ Test email sent successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Hint: Check your App Password. It might be invalid or 2FA is needed.');
        }
    }
}

main();
