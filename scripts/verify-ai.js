const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) return console.error('No .env.local');

        const envContent = fs.readFileSync(envPath, 'utf8');
        let apiKey = '';
        envContent.split('\n').forEach(line => {
            const match = line.match(/^GEMINI_API_KEY\s*=\s*(.*)$/);
            if (match) {
                apiKey = match[1].trim();
                if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
                    apiKey = apiKey.slice(1, -1);
                }
            }
        });

        if (!apiKey) return console.error('No API Key');

        const genAI = new GoogleGenerativeAI(apiKey);

        const modelsToTest = ["gemini-2.0-flash", "gemini-flash-latest"];

        for (const modelName of modelsToTest) {
            console.log(`\nTesting model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log(`✅ Success with ${modelName}`);
            } catch (e) {
                console.log(`❌ Failed with ${modelName}: ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

main();
