const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function main() {
    // Read .env.local
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

    const cmd = `curl "https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log('Models:', stdout);
        if (stderr) console.error('Stderr:', stderr);
    });
}

main();
