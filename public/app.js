// Smriti — Reminiscence Therapy Frontend Engine (Sarvam AI + Web Audio + Canvas Reel)

const PRESETS = {
  monsoon: {
    parentName: "Maa",
    era: "1970s",
    hometown: "Cuttack by the Mahanadi river",
    language: "od-IN",
    speaker: "ritu",
    sound: "monsoon",
    memorySeed:
      "Sitting on the cool red-oxide verandah during the first July monsoon rain, floating handmade paper boats in the courtyard puddles while Bou roasted sweet ripe mangoes and played soft bhajans on the old Murphy radio.",
  },
  train: {
    parentName: "Bapa",
    era: "1960s",
    hometown: "Malda to Howrah meter-gauge railway",
    language: "bn-IN",
    speaker: "shubh",
    sound: "train",
    memorySeed:
      "Looking out the wooden-shuttered window of the morning passenger train during summer holidays, sipping hot chai from earthen kulhads at a small station while green paddy fields and palm trees drifted past.",
  },
  kitchen: {
    parentName: "Nani",
    era: "1980s",
    hometown: "Old Jaipur haveli courtyard",
    language: "hi-IN",
    speaker: "ritu",
    sound: "temple",
    memorySeed:
      "Sunday mornings when the aroma of cardamom tea and warm ghee parathas filled the sunlit courtyard while evening temple bells echoed down the lane and everyone gathered around the radio.",
  },
};

// State
let activeSoundscape = "monsoon";
let uploadedImages = [];
let currentAudioClips = [];
let isPlayingVoice = false;
let currentAudioObj = null;
let chatHistory = [];
let currentSessionContext = "";

// Web Audio API Soundscape Engine
let audioCtx = null;
let ambientGain = null;
let ambientNodes = [];
let ambientTimer = null;
let isAmbientRunning = false;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    ambientGain = audioCtx.createGain();
    ambientGain.gain.value = parseFloat(
      document.getElementById("ambientVol").value || "0.28"
    );
    ambientGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function stopAmbientSoundscape() {
  if (ambientTimer) {
    clearInterval(ambientTimer);
    ambientTimer = null;
  }
  for (const node of ambientNodes) {
    try {
      node.stop?.();
      node.disconnect?.();
    } catch {
      // ignore
    }
  }
  ambientNodes = [];
  isAmbientRunning = false;
  const btn = document.getElementById("ambientToggleBtn");
  if (btn) btn.textContent = "🔊 Preview Soundscape Only";
}

function startAmbientSoundscape(type = activeSoundscape) {
  initAudioContext();
  stopAmbientSoundscape();
  isAmbientRunning = true;

  const btn = document.getElementById("ambientToggleBtn");
  if (btn) btn.textContent = "⏹ Stop Soundscape";

  if (type === "monsoon") {
    // Pink-filtered rain noise
    const bufferSize = audioCtx.sampleRate * 3;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1150;

    whiteNoise.connect(filter);
    filter.connect(ambientGain);
    whiteNoise.start(0);
    ambientNodes.push(whiteNoise, filter);
  } else if (type === "tanpura") {
    // Warm Sa-Pa-Sa harmonic Indian drone (C3, G3, C4)
    const freqs = [130.81, 196.0, 261.63];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      osc.type = idx === 1 ? "triangle" : "sine";
      osc.frequency.value = f;
      subGain.gain.value = 0.14 / (idx + 1);
      osc.connect(subGain);
      subGain.connect(ambientGain);
      osc.start();
      ambientNodes.push(osc, subGain);
    });
  } else if (type === "temple") {
    // Warm harmonic drone + periodic soft brass bell chime
    const playBell = () => {
      if (!isAmbientRunning) return;
      const now = audioCtx.currentTime;
      const partials = [528, 1056, 1584];
      partials.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.18 / (i + 1), now);
        g.gain.exponentialRampToValueAtTime(0.0008, now + 3.6);
        osc.connect(g);
        g.connect(ambientGain);
        osc.start(now);
        osc.stop(now + 3.7);
      });
    };
    playBell();
    ambientTimer = setInterval(playBell, 4500);
  } else if (type === "train") {
    // Soft rhythmic rail cadence
    const playChug = () => {
      if (!isAmbientRunning) return;
      const now = audioCtx.currentTime;
      [0, 0.22, 0.48, 0.7].forEach((offset, idx) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = idx % 2 === 0 ? 78 : 66;
        g.gain.setValueAtTime(0.18, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
        osc.connect(g);
        g.connect(ambientGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    };
    playChug();
    ambientTimer = setInterval(playChug, 1300);
  }
}

// Play sequential base64 audio clips returned by Sarvam Bulbul v3
async function playAudioSequence(base64Clips) {
  if (!base64Clips || base64Clips.length === 0) return;

  isPlayingVoice = true;
  updatePlayButtonUI();
  startAmbientSoundscape(activeSoundscape);

  for (let i = 0; i < base64Clips.length; i++) {
    if (!isPlayingVoice) break;
    const clip = base64Clips[i];
    const src = clip.startsWith("data:")
      ? clip
      : `data:audio/wav;base64,${clip}`;

    await new Promise((resolve) => {
      currentAudioObj = new Audio(src);
      currentAudioObj.onended = resolve;
      currentAudioObj.onerror = resolve;
      currentAudioObj.play().catch(resolve);
    });
  }

  isPlayingVoice = false;
  currentAudioObj = null;
  updatePlayButtonUI();
}

function stopVoiceAndAmbience() {
  isPlayingVoice = false;
  if (currentAudioObj) {
    currentAudioObj.pause();
    currentAudioObj = null;
  }
  stopAmbientSoundscape();
  updatePlayButtonUI();
}

function updatePlayButtonUI() {
  const playIcon = document.getElementById("playIcon");
  const playLabel = document.getElementById("playLabel");
  if (isPlayingVoice) {
    playIcon.textContent = "⏹";
    playLabel.textContent = "Stop Therapy Narration";
  } else {
    playIcon.textContent = "▶";
    playLabel.textContent = "Play Voice & Soundscape";
  }
}

// Vintage Memory Reel Canvas Animator (Ken Burns effect + Sarvam warm sepia aesthetic)
const canvas = document.getElementById("memoryCanvas");
const ctx = canvas.getContext("2d");
let animTick = 0;

function renderMemoryCanvas() {
  animTick += 0.005;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (uploadedImages.length > 0) {
    const slideDuration = 4.5;
    const totalIndex = Math.floor(animTick / slideDuration);
    const img = uploadedImages[totalIndex % uploadedImages.length];
    const progress = (animTick % slideDuration) / slideDuration;
    const scale = 1.04 + progress * 0.12;

    const iw = img.width;
    const ih = img.height;
    const ratio = Math.max(w / iw, h / ih) * scale;
    const nw = iw * ratio;
    const nh = ih * ratio;
    const ox = (w - nw) / 2 + Math.sin(animTick) * 12;
    const oy = (h - nh) / 2 + Math.cos(animTick * 0.8) * 8;

    ctx.save();
    ctx.filter = "sepia(22%) contrast(103%) brightness(97%)";
    ctx.drawImage(img, ox, oy, nw, nh);
    ctx.restore();
  } else {
    // Illustrated Warm Indian Nostalgia Backdrop (Terracotta + Indigo Twilight)
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#1B263B");
    grad.addColorStop(0.52, "#463B52");
    grad.addColorStop(1, "#C95B35");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Warm sun / mandala glow
    const sunY = h * 0.56 + Math.sin(animTick * 0.7) * 6;
    const radial = ctx.createRadialGradient(w * 0.5, sunY, 10, w * 0.5, sunY, 210);
    radial.addColorStop(0, "rgba(255, 226, 175, 0.52)");
    radial.addColorStop(0.5, "rgba(216, 90, 52, 0.18)");
    radial.addColorStop(1, "rgba(27, 38, 59, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    // Traditional courtyard arches silhouette
    ctx.fillStyle = "rgba(20, 25, 36, 0.55)";
    ctx.fillRect(0, h - 58, w, 58);

    // Gentle rain or golden memory motes
    ctx.strokeStyle = "rgba(255, 244, 224, 0.24)";
    ctx.fillStyle = "rgba(255, 234, 190, 0.45)";
    for (let i = 0; i < 28; i++) {
      const x = ((i * 97 + animTick * 40) % w);
      const y = ((i * 53 + animTick * (activeSoundscape === "monsoon" ? 190 : 35)) % h);
      if (activeSoundscape === "monsoon") {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 4, y + 14);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, (i % 3) + 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Soft warm vignette
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.65);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(18, 22, 32, 0.48)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  requestAnimationFrame(renderMemoryCanvas);
}
requestAnimationFrame(renderMemoryCanvas);

// DOM Event Listeners
document.getElementById("pace").addEventListener("input", (e) => {
  document.getElementById("paceVal").textContent = `${e.target.value}x`;
});

document.getElementById("ambientVol").addEventListener("input", (e) => {
  if (ambientGain) {
    ambientGain.gain.value = parseFloat(e.target.value);
  }
});

document.querySelectorAll(".sound-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".sound-card")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeSoundscape = btn.dataset.sound;
    if (isAmbientRunning) {
      startAmbientSoundscape(activeSoundscape);
    }
  });
});

document.getElementById("ambientToggleBtn").addEventListener("click", () => {
  if (isAmbientRunning) {
    stopAmbientSoundscape();
  } else {
    startAmbientSoundscape(activeSoundscape);
  }
});

document.getElementById("playSessionBtn").addEventListener("click", () => {
  if (isPlayingVoice) {
    stopVoiceAndAmbience();
  } else if (currentAudioClips.length > 0) {
    playAudioSequence(currentAudioClips);
  } else {
    startAmbientSoundscape(activeSoundscape);
  }
});

// Preset Chips
document.querySelectorAll(".chip-btn").forEach((chip) => {
  chip.addEventListener("click", () => {
    const preset = PRESETS[chip.dataset.preset];
    if (!preset) return;
    document.getElementById("parentName").value = preset.parentName;
    document.getElementById("era").value = preset.era;
    document.getElementById("hometown").value = preset.hometown;
    document.getElementById("language").value = preset.language;
    document.getElementById("speaker").value = preset.speaker;
    document.getElementById("memorySeed").value = preset.memorySeed;

    activeSoundscape = preset.sound;
    document.querySelectorAll(".sound-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.sound === preset.sound);
    });
  });
});

// Text Size Switcher
document.querySelectorAll(".size-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const container = document.getElementById("storyContainer");
    container.className = `story-container size-${btn.dataset.size}`;
  });
});

// Photo Upload Handler
const uploadZone = document.getElementById("uploadZone");
const photoInput = document.getElementById("photoInput");
const photoThumbs = document.getElementById("photoThumbs");

uploadZone.addEventListener("click", () => photoInput.click());
photoInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []).slice(0, 6);
  if (!files.length) return;
  uploadedImages = [];
  photoThumbs.innerHTML = "";

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => uploadedImages.push(img);
      img.src = ev.target.result;

      const thumb = document.createElement("img");
      thumb.src = ev.target.result;
      thumb.alt = file.name;
      photoThumbs.appendChild(thumb);
    };
    reader.readAsDataURL(file);
  });
});

// Submit Memory Form -> Call /api/generate-session
document.getElementById("memory-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const generateBtn = document.getElementById("generateBtn");
  const generateBtnText = document.getElementById("generateBtnText");
  const audioStatus = document.getElementById("audioStatus");

  const payload = {
    parentName: document.getElementById("parentName").value.trim(),
    era: document.getElementById("era").value,
    hometown: document.getElementById("hometown").value.trim(),
    memorySeed: document.getElementById("memorySeed").value.trim(),
    language: document.getElementById("language").value,
    speaker: document.getElementById("speaker").value,
    pace: parseFloat(document.getElementById("pace").value),
  };

  generateBtn.disabled = true;
  generateBtnText.textContent =
    "Weaving Story, Translating & Synthesizing Voice via Sarvam AI…";
  audioStatus.textContent =
    "Calling sarvam-105b-conversations → sarvam-translate:v1 → bulbul:v3…";

  try {
    const res = await fetch("/api/generate-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || "Failed to generate session");
    }

    document.getElementById("sanctuary-heading").textContent = data.title;
    document.getElementById(
      "reelEraBadge"
    ).textContent = `${payload.era} · ${payload.hometown}`;
    document.getElementById(
      "nativeLangTag"
    ).textContent = `${data.languageLabel} · Sarvam Translate + Bulbul v3 (${data.speaker})`;
    document.getElementById("nativeStoryText").textContent = data.nativeStory;
    document.getElementById("englishStoryText").textContent = data.englishStory;
    document.getElementById("videoPromptText").textContent = data.videoPrompt;
    document.getElementById("reelCaption").textContent = data.videoPrompt;

    currentSessionContext = data.englishStory;
    currentAudioClips = data.audioClips || [];
    chatHistory = [];
    document.getElementById("chatLog").innerHTML = "";

    // Populate Gentle Recall Questions
    const recallList = document.getElementById("recallList");
    recallList.innerHTML = "";
    (data.nativeQuestions || []).forEach((q, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "recall-pill";
      const engSub = data.recallQuestions?.[idx]
        ? ` (${data.recallQuestions[idx]})`
        : "";
      btn.textContent = `✦ ${q}${engSub}`;
      btn.addEventListener("click", () => {
        sendCompanionMessage(q);
      });
      recallList.appendChild(btn);
    });

    const playBtn = document.getElementById("playSessionBtn");
    playBtn.disabled = false;

    if (currentAudioClips.length > 0) {
      audioStatus.innerHTML = `✦ Ready (${currentAudioClips.length} voice segment${
        currentAudioClips.length > 1 ? "s" : ""
      } synthesized with <code>bulbul:v3</code>). Playing with ${activeSoundscape} soundscape…`;
      playAudioSequence(currentAudioClips);
    } else {
      audioStatus.textContent = data.ttsWarning
        ? `Story & translation ready (TTS note: ${data.ttsWarning})`
        : "Story & translation ready.";
    }
  } catch (err) {
    audioStatus.textContent = `Error: ${err.message}`;
  } finally {
    generateBtn.disabled = false;
    generateBtnText.textContent = "Weave Native Memory & Voice with Sarvam AI";
  }
});

// Interactive Multi-turn Reminiscence Companion
async function sendCompanionMessage(userText) {
  if (!userText.trim()) return;
  const chatLog = document.getElementById("chatLog");
  const input = document.getElementById("companionInput");
  input.value = "";

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.textContent = userText;
  chatLog.appendChild(userBubble);

  chatHistory.push({ role: "user", content: userText });

  const botBubble = document.createElement("div");
  botBubble.className = "chat-bubble assistant";
  botBubble.textContent = "Smriti is listening warmly…";
  chatLog.appendChild(botBubble);
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const res = await fetch("/api/chat-companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentName: document.getElementById("parentName").value.trim(),
        storyContext:
          currentSessionContext ||
          document.getElementById("memorySeed").value.trim(),
        language: document.getElementById("language").value,
        speaker: document.getElementById("speaker").value,
        pace: parseFloat(document.getElementById("pace").value),
        messages: chatHistory,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || "Companion error");
    }

    botBubble.textContent = data.reply;
    chatHistory.push({ role: "assistant", content: data.reply });
    chatLog.scrollTop = chatLog.scrollHeight;

    if (data.audioClips && data.audioClips.length > 0) {
      playAudioSequence(data.audioClips);
    }
  } catch (err) {
    botBubble.textContent = `Could not reach Smriti: ${err.message}`;
  }
}

document.getElementById("companionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("companionInput");
  sendCompanionMessage(input.value);
});

document.querySelectorAll(".recall-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    sendCompanionMessage(pill.dataset.prompt || pill.textContent);
  });
});

// Web Speech API Microphone Input (Native Indian Language Dictation)
const micBtn = document.getElementById("micBtn");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    recognition.lang = document.getElementById("language").value || "hi-IN";
    micBtn.textContent = "🔴";
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    document.getElementById("companionInput").value = transcript;
    micBtn.textContent = "🎙️";
  };

  recognition.onerror = () => {
    micBtn.textContent = "🎙️";
  };
  recognition.onend = () => {
    micBtn.textContent = "🎙️";
  };
} else {
  micBtn.style.display = "none";
}
