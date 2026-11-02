import { SarvamAIClient } from "sarvamai";

const apiKey = process.env.SARVAM_API_KEY;
if (!apiKey) {
  console.error("Missing SARVAM_API_KEY in environment (.env).");
  process.exit(1);
}

const client = new SarvamAIClient({
  apiSubscriptionKey: apiKey,
});

const response = await client.chat.completions({
  model: "sarvam-105b-conversations",
  messages: [
    {
      role: "system",
      content:
        "You are a warm, empathetic reminiscence therapy companion helping families reconnect with childhood memories across Indian languages.",
    },
    {
      role: "user",
      content:
        "Namaste! Give me a brief 2-sentence warm greeting for a parent starting a reminiscence memory session.",
    },
  ],
});

console.log(response.choices[0].message.content);
