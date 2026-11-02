const SARVAM_BASE = "https://api.sarvam.ai";

const LANGUAGE_LABELS = {
  "hi-IN": "Hindi (हिन्दी)",
  "od-IN": "Odia (ଓଡ଼ିଆ)",
  "bn-IN": "Bengali (বাংলা)",
  "ta-IN": "Tamil (தமிழ்)",
  "te-IN": "Telugu (తెలుగు)",
  "mr-IN": "Marathi (मराठी)",
  "gu-IN": "Gujarati (ગુજરાતી)",
  "kn-IN": "Kannada (ಕನ್ನಡ)",
  "ml-IN": "Malayalam (മലയാളം)",
  "pa-IN": "Punjabi (ਪੰਜਾਬੀ)",
};

const LEGACY_TO_V4_SPEAKER = {
  ritu: "ritu_hi_customer_warm",
  ishita: "ishita_en_stories",
  priya: "roopa_hi_companion",
  simran: "simran_en_therapist",
  shubh: "shubh_en_narration_gentle",
  aditya: "ratan_hi_latenight_warm",
  arjun: "ratan_hi_latenight_warm",
  ratan: "ratan_hi_latenight_warm",
  kabir: "kabir_hi_conversational",
};

const VALID_BULBUL_V4_SPEAKERS = new Set([
  "ritu_hi_customer_warm",
  "ritu_hi_conversation",
  "roopa_hi_companion",
  "roopa_hi_narration",
  "simran_en_therapist",
  "simran_hi_narration",
  "ishita_en_stories",
  "ishita_enhi_companion",
  "sanchita_en_companion",
  "shalini_hi_companion",
  "suman_hi_companion",
  "shubh_en_narration_gentle",
  "shubh_hi_stories_mixed",
  "shubh_hi_devotional",
  "ratan_hi_latenight_warm",
  "kabir_hi_conversational",
  "aditya_hi_conversational",
  "arnab_bn_conversation",
  "roopa_bn_conversational",
  "pooja_gu_conversational",
  "chaitra_kn_narration",
  "rupali_mr_stories",
  "soham_mr_narration",
  "harpreet_pa_narration",
  "gokul_ta_narration",
  "vijay_ta_narration",
  "kavitha_te_narration",
  "tarun_te_narration",
]);

function normalizeSpeaker(speaker) {
  const clean = (speaker || "ritu_hi_customer_warm").toLowerCase().trim();
  if (VALID_BULBUL_V4_SPEAKERS.has(clean)) return clean;
  if (LEGACY_TO_V4_SPEAKER[clean]) return LEGACY_TO_V4_SPEAKER[clean];
  return "ritu_hi_customer_warm";
}

function sanitizeTextForTTS(text) {
  return (text || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/[*_#`~>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function splitTextIntoChunks(text, maxLen = 280) {
  const cleaned = sanitizeTextForTTS(text);
  if (!cleaned) return [];
  if (cleaned.length <= maxLen) return [cleaned];

  const sentences = cleaned.split(/(?<=[।.!?|])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxLen) {
      current = (current + " " + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length <= maxLen) {
        current = sentence;
      } else {
        for (let i = 0; i < sentence.length; i += maxLen) {
          chunks.push(sentence.slice(i, i + maxLen));
        }
        current = "";
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 6);
}

async function sarvamChat(apiKey, messages, temperature = 0.65) {
  const res = await fetch(`${SARVAM_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sarvam-105b-conversations",
      messages,
      temperature,
      max_tokens: 900,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sarvam Chat API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

async function sarvamTranslate(apiKey, input, targetLang) {
  const trimmed = (input || "").slice(0, 950);
  if (!trimmed) return "";
  const res = await fetch(`${SARVAM_BASE}/translate`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: trimmed,
      source_language_code: "en-IN",
      target_language_code: targetLang,
      model: "sarvam-translate:v1",
      mode: "formal",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sarvam Translate API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.translated_text || trimmed;
}

async function sarvamTTS(
  apiKey,
  text,
  targetLang,
  speaker = "ritu_hi_customer_warm",
  pace = 0.88
) {
  const safeSpeaker = normalizeSpeaker(speaker);
  const safePace = Math.min(1.5, Math.max(0.5, Number(pace) || 0.88));
  const chunks = splitTextIntoChunks(text, 280);
  if (chunks.length === 0) return { audioClips: [], audioSegments: [] };

  const audioClips = [];
  const audioSegments = [];
  for (const chunk of chunks) {
    const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: chunk,
        target_language_code: targetLang || "hi-IN",
        speaker: safeSpeaker,
        model: "bulbul:v4-flash",
        pace: safePace,
        enable_preprocessing: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Sarvam TTS API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    if (Array.isArray(data.audios) && data.audios[0]) {
      audioClips.push(data.audios[0]);
      audioSegments.push({
        text: chunk,
        audio: data.audios[0],
      });
    }
  }
  return { audioClips, audioSegments };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true });
    }

    const apiKey = env?.SARVAM_API_KEY;

    // 1. Health check endpoint
    if (url.pathname === "/api/health") {
      return jsonResponse({
        ok: true,
        configured: Boolean(apiKey),
        models: {
          chat: "sarvam-105b-conversations",
          translate: "sarvam-translate:v1",
          tts: "bulbul:v4-flash",
        },
      });
    }

    // 2. On-Demand TTS endpoint for past capsules & past conversation messages
    if (url.pathname === "/api/tts" && request.method === "POST") {
      if (!apiKey) {
        return jsonResponse(
          { error: "SARVAM_API_KEY is not configured in environment." },
          500
        );
      }

      try {
        const body = await request.json();
        const {
          text = "",
          language = "hi-IN",
          speaker = "ritu",
          pace = 0.88,
        } = body;

        const safeSpeaker = normalizeSpeaker(speaker);
        const ttsResult = await sarvamTTS(
          apiKey,
          text,
          language,
          safeSpeaker,
          pace
        );

        return jsonResponse({
          speaker: safeSpeaker,
          audioClips: ttsResult.audioClips,
          audioSegments: ttsResult.audioSegments,
        });
      } catch (err) {
        return jsonResponse({ error: err.message || "TTS failed" }, 500);
      }
    }

    // 3. Generate Reminiscence Therapy Story + Native Translation + Bulbul v3 Voice
    if (url.pathname === "/api/generate-session" && request.method === "POST") {
      if (!apiKey) {
        return jsonResponse(
          { error: "SARVAM_API_KEY is not configured in environment." },
          500
        );
      }

      try {
        const body = await request.json();
        const {
          parentName = "Maa",
          era = "1970s",
          hometown = "our old family courtyard",
          memorySeed = "",
          language = "hi-IN",
          speaker = "ritu",
          pace = 0.88,
        } = body;

        const safeSpeaker = normalizeSpeaker(speaker);
        const langName = LANGUAGE_LABELS[language] || language;

        const systemPrompt = `You are 'Smriti', an empathetic Indian Reminiscence Therapy specialist for elders living with dementia.
Given a family member's memory note, craft a soothing, sensory-rich second-person reminiscence story in English (around 90-120 words) addressed warmly to "${parentName}", followed by 3 gentle open-ended recall questions, and a 1-sentence visual prompt suitable for Gemini Video generation.

Respond strictly in valid JSON with keys:
{
  "title": "Warm poetic title",
  "englishStory": "Soothing sensory story in English (90-120 words, warm and unhurried)",
  "recallQuestions": ["Question 1", "Question 2", "Question 3"],
  "videoPrompt": "Cinematic nostalgic Indian scene description for video generation"
}`;

        const userPrompt = `Parent Name: ${parentName}
Era / Decade: ${era}
Place / Hometown: ${hometown}
Target Native Language: ${langName}
Family Memory Note: ${memorySeed}`;

        const rawReply = await sarvamChat(apiKey, [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ]);

        let parsed = null;
        try {
          const jsonMatch = rawReply.match(/\{[\s\S]*\}/);
          parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawReply);
        } catch {
          parsed = {
            title: `Memories of ${hometown} (${era})`,
            englishStory: rawReply.replace(/```json|```/g, "").trim(),
            recallQuestions: [
              `What was your favorite aroma or sound in ${hometown}?`,
              `Who used to sit with you during those quiet afternoons?`,
              `What song or story from the ${era} still makes you smile?`,
            ],
            videoPrompt: `Warm vintage ${era} Indian film aesthetic showing ${hometown}, golden afternoon sunlight, gentle motion, nostalgic atmosphere.`,
          };
        }

        // Translate story and recall questions into parent's native language
        const [nativeStory, nativeQuestionsRaw] = await Promise.all([
          sarvamTranslate(apiKey, parsed.englishStory, language),
          sarvamTranslate(
            apiKey,
            (parsed.recallQuestions || []).join(" | "),
            language
          ),
        ]);

        const nativeQuestions = nativeQuestionsRaw
          .split("|")
          .map((q) => q.trim())
          .filter(Boolean);

        // Generate soothing TTS audio in native language via Bulbul v3
        let audioClips = [];
        let audioSegments = [];
        let ttsWarning = null;
        try {
          const ttsResult = await sarvamTTS(
            apiKey,
            nativeStory,
            language,
            safeSpeaker,
            pace
          );
          audioClips = ttsResult.audioClips;
          audioSegments = ttsResult.audioSegments;
        } catch (ttsErr) {
          ttsWarning = ttsErr.message;
        }

        return jsonResponse({
          title: parsed.title || `Memories of ${hometown}`,
          englishStory: parsed.englishStory,
          nativeStory,
          recallQuestions: parsed.recallQuestions || [],
          nativeQuestions:
            nativeQuestions.length > 0
              ? nativeQuestions
              : parsed.recallQuestions || [],
          videoPrompt: parsed.videoPrompt,
          language,
          languageLabel: langName,
          speaker: safeSpeaker,
          audioClips,
          audioSegments,
          ttsWarning,
        });
      } catch (err) {
        return jsonResponse({ error: err.message || "Generation failed" }, 500);
      }
    }

    // 4. Interactive Multi-Turn Reminiscence Conversation (sarvam-105b-conversations)
    if (url.pathname === "/api/chat-companion" && request.method === "POST") {
      if (!apiKey) {
        return jsonResponse(
          { error: "SARVAM_API_KEY is not configured in environment." },
          500
        );
      }

      try {
        const body = await request.json();
        const {
          parentName = "Maa",
          storyContext = "",
          language = "hi-IN",
          speaker = "ritu",
          pace = 0.88,
          messages = [],
        } = body;

        const safeSpeaker = normalizeSpeaker(speaker);
        const langName = LANGUAGE_LABELS[language] || language;

        const systemMessage = {
          role: "system",
          content: `You are Smriti, a gentle, patient reminiscence therapy companion speaking directly with ${parentName} in ${langName} (write strictly in the native Indic script of ${langName}, no markdown asterisks).
Keep your response short (2-3 warm sentences), comforting, never correcting or testing their memory, only validating their feelings and gently inviting another sensory detail about this memory: "${storyContext}".`,
        };

        let reply = await sarvamChat(
          apiKey,
          [systemMessage, ...messages.slice(-8)],
          0.6
        );

        reply = sanitizeTextForTTS(reply);

        let audioClips = [];
        let audioSegments = [];
        let ttsWarning = null;
        try {
          const ttsRes = await sarvamTTS(
            apiKey,
            reply,
            language,
            safeSpeaker,
            pace
          );
          audioClips = ttsRes.audioClips;
          audioSegments = ttsRes.audioSegments;
        } catch (ttsErr) {
          ttsWarning = ttsErr.message;
        }

        return jsonResponse({
          reply,
          speaker: safeSpeaker,
          audioClips,
          audioSegments,
          ttsWarning,
        });
      } catch (err) {
        return jsonResponse({ error: err.message || "Chat failed" }, 500);
      }
    }

    // 5. Static assets fallback (Cloudflare Workers Assets binding)
    if (env?.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  },
};
