// ============================================================================
// Smriti (स्मृति) — Two-Portal Reminiscence Therapy Engine
// Features: Sarvam Dark/Light Theme, Family Studio + Elder Sanctuary Portals,
// Synchronized "Writes as it Speaks" Live Story Stage Card, On-Demand TTS,
// Clipboard Image Paste (Ctrl+V) + Drag & Drop, and Saved Capsule Deletion
// ============================================================================

const PRESETS = {
  monsoon: {
    parentName: "Maa",
    era: "1970s",
    hometown: "Cuttack by the Mahanadi river",
    language: "od-IN",
    speaker: "ritu_hi_customer_warm",
    sound: "monsoon",
    memorySeed:
      "Sitting on the cool red-oxide verandah during the first July monsoon rain, floating handmade paper boats in the courtyard puddles while Bou roasted sweet ripe mangoes and played soft bhajans on the old Murphy radio.",
  },
  train: {
    parentName: "Bapa",
    era: "1960s",
    hometown: "Malda to Howrah meter-gauge railway",
    language: "bn-IN",
    speaker: "shubh_en_narration_gentle",
    sound: "train",
    memorySeed:
      "Looking out the wooden-shuttered window of the morning passenger train during summer holidays, sipping hot chai from earthen kulhads at a small station while green paddy fields and palm trees drifted past.",
  },
  kitchen: {
    parentName: "Nani",
    era: "1980s",
    hometown: "Old Jaipur haveli courtyard",
    language: "hi-IN",
    speaker: "ritu_hi_customer_warm",
    sound: "temple",
    memorySeed:
      "Sunday mornings when the aroma of cardamom tea and warm ghee parathas filled the sunlit courtyard while evening temple bells echoed down the lane and everyone gathered around the radio.",
  },
};

const STARTER_CAPSULES = [
  {
    id: "cap-monsoon-hi",
    parentName: "Maa",
    era: "1970s",
    hometown: "Old Family Courtyard",
    language: "hi-IN",
    languageLabel: "Hindi (हिन्दी)",
    speaker: "ritu_hi_customer_warm",
    sound: "monsoon",
    title: "सावन की पहली बारिश और कागज़ की कश्तियाँ",
    nativeStory:
      "माँ, क्या आपको सत्तर के दशक की वह शांत दोपहर याद है? जब जुलाई की पहली बारिश आँगन की लाल फर्श को ठंडा कर देती थी, और आप बरामदे में बैठकर कागज़ की छोटी नावों को पानी में तैरते हुए देखती थीं। रसोई से भुने हुए मीठे आमों की खुशबू आती थी और पुराने रेडियो पर धीमे भजन गूंजते थे।",
    englishStory:
      "Maa, do you remember those unhurried afternoons of the 1970s? When the first July rain cooled the red-oxide courtyard floor, and you sat on the verandah watching little paper boats drift across the puddles while the sweet aroma of roasted mangoes and soft radio bhajans filled the air.",
    nativeQuestions: [
      "क्या आपको उस आँगन में मिट्टी और पहली बारिश की खुशबू याद है?",
      "बारिश के दिनों में आपके साथ बरामदे में कौन बैठता था?",
      "पुराने रेडियो पर कौन सा भजन या गीत आपको सबसे प्रिय था?",
    ],
    recallQuestions: [
      "Do you remember the scent of wet earth and the first rain in that courtyard?",
      "Who used to sit beside you on the verandah during monsoon afternoons?",
      "Which song or bhajan on the old radio was your favorite?",
    ],
    videoPrompt:
      "Warm 1970s Indian film aesthetic showing a traditional red-oxide courtyard during gentle monsoon rain, paper boats floating in puddles, golden lantern light.",
    audioClips: [],
    audioSegments: [],
    chatMessages: [],
    photoDataUrls: [],
  },
  {
    id: "cap-monsoon-od",
    parentName: "Maa",
    era: "1970s",
    hometown: "Cuttack by the Mahanadi",
    language: "od-IN",
    languageLabel: "Odia (ଓଡ଼ିଆ)",
    speaker: "ritu_hi_customer_warm",
    sound: "monsoon",
    title: "ମହାନଦୀ ତୀରର ବର୍ଷା ଓ କାଗଜ ଡଙ୍ଗା",
    nativeStory:
      "ମା, ତୁମର ମନେ ଅଛି କି କଟକର ସେହି ପୁରୁଣା ଅଗଣା ଓ ଆଷାଢ଼ର ପ୍ରଥମ ବର୍ଷା? ଯେତେବେଳେ ଥଣ୍ଡା ବାରଣ୍ଡାରେ ବସି ତୁମେ ବର୍ଷା ପାଣିରେ କାଗଜ ଡଙ୍ଗା ଭସାଉଥିଲ, ଆଉ ଘର ଭିତରୁ ପାଚିଲା ଆମ୍ବର ମହକ ଓ ପୁରୁଣା ରେଡିଓରୁ ଭଜନ ଶୁଭୁଥିଲା।",
    englishStory:
      "Maa, do you remember that old courtyard in Cuttack and the first monsoon rain? Sitting on the cool verandah floating paper boats in the rainwater, while the fragrance of ripe mangoes and gentle bhajans from the old radio drifted through the house.",
    nativeQuestions: [
      "ବର୍ଷା ଦିନେ ଅଗଣାରେ କାଗଜ ଡଙ୍ଗା ଭସାଇବା କଥା ତୁମର ମନେ ପଡ଼େ କି?",
      "ସେହି ସମୟରେ ତୁମ ପାଖରେ କିଏ ବସି ଗପ ଶୁଣାଉଥିଲେ?",
    ],
    recallQuestions: [
      "Do you remember floating paper boats in the courtyard during the rains?",
      "Who used to sit beside you and tell stories on those afternoons?",
    ],
    videoPrompt:
      "Nostalgic 1970s Cuttack courtyard in monsoon rain, paper boats, Mahanadi river breeze, warm sepia cinema lighting.",
    audioClips: [],
    audioSegments: [],
    chatMessages: [],
    photoDataUrls: [],
  },
];

// Load saved capsules list from localStorage (excluding large base64 audio to stay within quota)
function loadPersistedCapsules() {
  try {
    const raw = localStorage.getItem("smriti_saved_capsules_v1");
    if (!raw) return structuredClone(STARTER_CAPSULES);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return structuredClone(STARTER_CAPSULES);
}

function persistCapsules() {
  try {
    const lightweight = capsules.map((c) => ({
      ...c,
      // Keep metadata, stories, questions, and photos; audioSegments synthesize on-demand if needed
      audioClips: [],
      audioSegments: [],
    }));
    localStorage.setItem(
      "smriti_saved_capsules_v1",
      JSON.stringify(lightweight)
    );
  } catch {
    // ignore storage quota warnings
  }
}

// Global State
let capsules = loadPersistedCapsules();
let activeCapsule = capsules[0] || null;
let activeSoundscape = "monsoon";

// Studio staged photos (array of dataURL strings) & active canvas Image objects
let stagedPhotoDataUrls = [];
let activeReelImages = [];

let isPlayingVoice = false;
let currentAudioObj = null;
let liveWriterRaf = null;
let liveWriterTimeout = null;
let playbackRunId = 0;

// ============================================================================
// 1. SARVAM DARK / LIGHT THEME ENGINE
// ============================================================================
const htmlEl = document.documentElement;
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  localStorage.setItem("smriti_theme", theme);
  if (theme === "dark") {
    themeIcon.textContent = "☀️";
    themeLabel.textContent = "Light Mode";
  } else {
    themeIcon.textContent = "🌙";
    themeLabel.textContent = "Sarvam Dark";
  }
}

const savedTheme = localStorage.getItem("smriti_theme") || "dark";
applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

// ============================================================================
// 2. TWO-PORTAL SWITCHER (Family Member Portal <-> User / Parent Portal)
// ============================================================================
function switchPortal(portalName) {
  document.querySelectorAll(".portal-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.portal === portalName);
  });
  document
    .getElementById("portal-family")
    .classList.toggle("active", portalName === "family");
  document
    .getElementById("portal-user")
    .classList.toggle("active", portalName === "user");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".portal-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchPortal(tab.dataset.portal));
});

document.getElementById("goToUserPortalBtn").addEventListener("click", () => {
  switchPortal("user");
  if (activeCapsule) {
    loadCapsuleIntoUserPortal(activeCapsule, true);
  }
});

document.getElementById("backToFamilyBtn").addEventListener("click", () => {
  stopVoiceAndAmbience();
  switchPortal("family");
});

// ============================================================================
// 3. PROCEDURAL WEB AUDIO AMBIENT SOUNDSCAPE ENGINE
// ============================================================================
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
    const playBell = () => {
      if (!isAmbientRunning) return;
      const now = audioCtx.currentTime;
      [528, 1056, 1584].forEach((freq, i) => {
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

// ============================================================================
// 4. BIG LIVE-WRITING STORY STAGE ENGINE ("Writes as it Speaks" + On-Demand TTS)
// ============================================================================
function renderLiveWriterState(words, activeIndex, showCursor = true) {
  const container = document.getElementById("liveNativeWriter");
  const progressFill = document.getElementById("writerProgressFill");
  const progressLabel = document.getElementById("writerProgressLabel");

  if (!words || words.length === 0) {
    container.innerHTML = "";
    return;
  }

  const pct = Math.min(
    100,
    Math.round(((activeIndex + 1) / words.length) * 100)
  );
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = `${pct}%`;

  const htmlParts = [];
  for (let i = 0; i < words.length; i++) {
    const escaped = words[i]
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    if (i < activeIndex) {
      htmlParts.push(`<span class="word-token spoken">${escaped}</span> `);
    } else if (i === activeIndex) {
      htmlParts.push(
        `<span class="word-token active-word">${escaped}</span>${
          showCursor ? '<span class="live-cursor"></span>' : ""
        } `
      );
    } else {
      htmlParts.push(`<span class="word-token pending">${escaped}</span> `);
    }
  }
  container.innerHTML = htmlParts.join("");
}

function setSpeakingStageState(speaking, statusText) {
  isPlayingVoice = speaking;
  const stageCard = document.getElementById("liveStageCard");
  const badgeText = document.getElementById("liveBadgeText");
  const playIcon = document.getElementById("playIcon");
  const playLabel = document.getElementById("playLabel");
  const audioStatus = document.getElementById("audioStatus");

  stageCard.classList.toggle("is-speaking", speaking);
  badgeText.textContent = speaking
    ? "Speaking & Writing Live…"
    : "Ready to Speak & Write";
  playIcon.textContent = speaking ? "⏹" : "▶";
  playLabel.textContent = speaking
    ? "Stop Speaking & Writing"
    : "Speak & Write Story Aloud";
  if (statusText) {
    audioStatus.textContent = statusText;
  }
}

function stopVoiceAndAmbience() {
  playbackRunId++;
  isPlayingVoice = false;
  if (liveWriterRaf) {
    cancelAnimationFrame(liveWriterRaf);
    liveWriterRaf = null;
  }
  if (liveWriterTimeout) {
    clearTimeout(liveWriterTimeout);
    liveWriterTimeout = null;
  }
  if (currentAudioObj) {
    currentAudioObj.pause();
    currentAudioObj = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  stopAmbientSoundscape();
  setSpeakingStageState(
    false,
    "Sarvam bulbul:v4-flash voice + soothing childhood soundscape"
  );
}

// Fetch Sarvam bulbul:v4-flash audio on-demand if a past capsule or chat reply lacks cached audioSegments
async function ensureAudioSegments(targetObj, text, language, speaker) {
  if (targetObj.audioSegments && targetObj.audioSegments.length > 0) {
    return targetObj.audioSegments;
  }
  if (targetObj.audioClips && targetObj.audioClips.length > 0) {
    targetObj.audioSegments = targetObj.audioClips.map((clip) => ({
      text,
      audio: clip,
    }));
    return targetObj.audioSegments;
  }

  try {
    const pace = parseFloat(document.getElementById("pace")?.value || "0.88");
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        language: language || "hi-IN",
        speaker: speaker || "ritu_hi_customer_warm",
        pace,
      }),
    });
    const data = await res.json();
    if (
      res.ok &&
      Array.isArray(data.audioSegments) &&
      data.audioSegments.length > 0
    ) {
      targetObj.audioClips = data.audioClips || [];
      targetObj.audioSegments = data.audioSegments;
      return targetObj.audioSegments;
    }
  } catch {
    // Fallback to paced visual writer if offline
  }
  return [];
}

// Synchronized playback: speaks via Sarvam Bulbul v4 Flash segments AND writes word-by-word!
async function speakAndWriteCapsule(capsule) {
  if (!capsule) return;
  stopVoiceAndAmbience();
  const myRunId = ++playbackRunId;

  const fullText = (capsule.nativeStory || "").trim();
  const allWords = fullText.split(/\s+/).filter(Boolean);
  if (allWords.length === 0) return;

  activeSoundscape = capsule.sound || activeSoundscape;
  startAmbientSoundscape(activeSoundscape);
  renderLiveWriterState(allWords, 0, true);

  setSpeakingStageState(
    true,
    `Synthesizing Sarvam bulbul:v4-flash voice (${capsule.speaker || "ritu_hi_customer_warm"})…`
  );

  const segments = await ensureAudioSegments(
    capsule,
    fullText,
    capsule.language,
    capsule.speaker
  );

  if (myRunId !== playbackRunId || !isPlayingVoice) return;

  setSpeakingStageState(
    true,
    `Speaking in ${capsule.languageLabel || capsule.language} (bulbul:v4-flash) with ${activeSoundscape} ambience…`
  );

  if (segments.length > 0) {
    let cumulativeWordIndex = 0;

    for (let s = 0; s < segments.length; s++) {
      if (myRunId !== playbackRunId || !isPlayingVoice) break;
      const seg = segments[s];
      const segWords = (seg.text || "").trim().split(/\s+/).filter(Boolean);
      const wordCount = Math.max(1, segWords.length);
      const startWordIdx = cumulativeWordIndex;

      const src = seg.audio.startsWith("data:")
        ? seg.audio
        : `data:audio/wav;base64,${seg.audio}`;

      await new Promise((resolve) => {
        const audio = new Audio(src);
        currentAudioObj = audio;

        const tick = () => {
          if (
            myRunId !== playbackRunId ||
            !isPlayingVoice ||
            currentAudioObj !== audio
          ) {
            return;
          }
          const dur =
            audio.duration && isFinite(audio.duration) && audio.duration > 0
              ? audio.duration
              : wordCount * 0.42;
          const ratio = Math.min(1, Math.max(0, audio.currentTime / dur));
          const localIdx = Math.min(
            wordCount - 1,
            Math.floor(ratio * wordCount)
          );
          const globalIdx = Math.min(
            allWords.length - 1,
            startWordIdx + localIdx
          );
          renderLiveWriterState(allWords, globalIdx, true);
          liveWriterRaf = requestAnimationFrame(tick);
        };

        audio.onplay = () => {
          liveWriterRaf = requestAnimationFrame(tick);
        };
        audio.onended = () => {
          if (liveWriterRaf) cancelAnimationFrame(liveWriterRaf);
          resolve();
        };
        audio.onerror = () => {
          if (liveWriterRaf) cancelAnimationFrame(liveWriterRaf);
          resolve();
        };
        audio.play().catch(() => resolve());
      });

      cumulativeWordIndex += wordCount;
    }

    if (myRunId === playbackRunId && isPlayingVoice) {
      renderLiveWriterState(allWords, allWords.length - 1, false);
      setSpeakingStageState(false, "Completed live narration & writing.");
    }
    return;
  }

  for (let i = 0; i < allWords.length; i++) {
    if (myRunId !== playbackRunId || !isPlayingVoice) break;
    renderLiveWriterState(allWords, i, i < allWords.length - 1);
    await new Promise((r) => {
      liveWriterTimeout = setTimeout(r, 290);
    });
  }

  if (myRunId === playbackRunId) {
    setSpeakingStageState(false, "Completed live story reveal.");
  }
}

// ============================================================================
// 5. CAPSULE GALLERY, DELETION & PORTAL SYNCHRONIZATION
// ============================================================================
function deleteCapsuleById(capsuleId) {
  capsules = capsules.filter((c) => c.id !== capsuleId);
  persistCapsules();

  if (activeCapsule?.id === capsuleId) {
    stopVoiceAndAmbience();
    activeCapsule = capsules[0] || null;
    if (activeCapsule) {
      loadCapsuleIntoUserPortal(activeCapsule, false);
    }
  }
  renderCapsuleLists();
}

function restoreStarterCapsules() {
  capsules = structuredClone(STARTER_CAPSULES);
  activeCapsule = capsules[0];
  persistCapsules();
  renderCapsuleLists();
  loadCapsuleIntoUserPortal(activeCapsule, false);
}

function renderCapsuleLists() {
  const familyList = document.getElementById("capsuleList");
  const userBar = document.getElementById("userCapsuleBar");

  familyList.innerHTML = "";
  userBar.innerHTML = "";

  if (capsules.length === 0) {
    const emptyBox = document.createElement("div");
    emptyBox.className = "capsule-empty";
    emptyBox.innerHTML = `
      <p>No saved memory capsules right now.</p>
      <button type="button" class="btn-mini" id="restoreStartersBtn">
        ↻ Restore Sample Memories
      </button>
    `;
    familyList.appendChild(emptyBox);
    emptyBox
      .querySelector("#restoreStartersBtn")
      ?.addEventListener("click", restoreStarterCapsules);
    return;
  }

  capsules.forEach((cap) => {
    // 1. Card in Family Portal with Delete button
    const card = document.createElement("div");
    card.className = `capsule-card ${
      cap.id === activeCapsule?.id ? "active" : ""
    }`;

    const topRow = document.createElement("div");
    topRow.className = "capsule-top";

    const tagSpan = document.createElement("span");
    tagSpan.className = "capsule-tag";
    tagSpan.textContent = `${cap.era} · ${cap.languageLabel || cap.language}`;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "capsule-actions";

    const playHint = document.createElement("span");
    playHint.className = "capsule-play-hint";
    playHint.textContent = "▶ Launch";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "capsule-delete-btn";
    delBtn.title = "Delete this saved memory";
    delBtn.textContent = "🗑️ Delete";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCapsuleById(cap.id);
    });

    actionsDiv.appendChild(playHint);
    actionsDiv.appendChild(delBtn);
    topRow.appendChild(tagSpan);
    topRow.appendChild(actionsDiv);

    const titleEl = document.createElement("h3");
    titleEl.className = "capsule-title";
    titleEl.textContent = cap.title;

    const previewEl = document.createElement("p");
    previewEl.className = "capsule-preview";
    previewEl.textContent = cap.nativeStory;

    card.appendChild(topRow);
    card.appendChild(titleEl);
    card.appendChild(previewEl);

    card.addEventListener("click", () => {
      activeCapsule = cap;
      renderCapsuleLists();
      switchPortal("user");
      loadCapsuleIntoUserPortal(cap, true);
    });
    familyList.appendChild(card);

    // 2. Pill in User/Parent Portal Top Bar
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `user-capsule-pill ${
      cap.id === activeCapsule?.id ? "active" : ""
    }`;
    pill.textContent = `🪷 ${cap.title}`;
    pill.addEventListener("click", () => {
      activeCapsule = cap;
      renderCapsuleLists();
      loadCapsuleIntoUserPortal(cap, true);
    });
    userBar.appendChild(pill);
  });
}

function renderChatHistoryForActiveCapsule() {
  const chatLog = document.getElementById("chatLog");
  chatLog.innerHTML = "";
  const messages = activeCapsule?.chatMessages || [];
  messages.forEach((msg) => appendChatBubbleToDOM(msg));
}

function appendChatBubbleToDOM(msgObj) {
  const chatLog = document.getElementById("chatLog");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${msgObj.role}`;

  const textSpan = document.createElement("span");
  textSpan.textContent = msgObj.content;
  bubble.appendChild(textSpan);

  if (msgObj.role === "assistant") {
    const replayBtn = document.createElement("button");
    replayBtn.type = "button";
    replayBtn.className = "chat-replay-btn";
    replayBtn.innerHTML = "🔊 Speak Response Aloud";
    replayBtn.addEventListener("click", async () => {
      replayBtn.textContent = "🔊 Speaking…";
      await speakAndWriteCapsule({
        ...activeCapsule,
        nativeStory: msgObj.content,
        audioClips: msgObj.audioClips || [],
        audioSegments: msgObj.audioSegments || [],
      });
      replayBtn.textContent = "🔊 Speak Response Aloud";
    });
    bubble.appendChild(replayBtn);
  }

  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
  return { bubble, textSpan };
}

function syncActiveReelImages(dataUrls = []) {
  const sources =
    dataUrls && dataUrls.length > 0 ? dataUrls : stagedPhotoDataUrls;
  activeReelImages = [];
  sources.forEach((url) => {
    const img = new Image();
    img.onload = () => activeReelImages.push(img);
    img.src = url;
  });
}

function loadCapsuleIntoUserPortal(capsule, autoSpeak = false) {
  if (!capsule) return;
  activeCapsule = capsule;
  if (!activeCapsule.chatMessages) activeCapsule.chatMessages = [];
  stopVoiceAndAmbience();

  syncActiveReelImages(capsule.photoDataUrls || []);

  document.getElementById("sanctuaryHeading").textContent = capsule.title;
  document.getElementById(
    "nativeLangTag"
  ).textContent = `${capsule.languageLabel || capsule.language} · Bulbul v4 Flash (${
    capsule.speaker || "ritu_hi_customer_warm"
  })`;
  document.getElementById("englishStoryText").textContent =
    capsule.englishStory;
  document.getElementById(
    "reelEraBadge"
  ).textContent = `${capsule.era} · ${capsule.hometown}`;
  document.getElementById("reelCaption").textContent =
    capsule.videoPrompt || capsule.englishStory;
  document.getElementById("videoPromptText").textContent =
    capsule.videoPrompt || "";

  const words = (capsule.nativeStory || "").trim().split(/\s+/).filter(Boolean);
  renderLiveWriterState(words, autoSpeak ? 0 : words.length - 1, autoSpeak);

  const recallList = document.getElementById("recallList");
  recallList.innerHTML = "";
  (capsule.nativeQuestions || []).forEach((q, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "recall-pill";
    const engSub = capsule.recallQuestions?.[idx]
      ? ` — ${capsule.recallQuestions[idx]}`
      : "";
    btn.textContent = `✦ ${q}${engSub}`;
    btn.addEventListener("click", () => {
      sendCompanionMessage(q);
    });
    recallList.appendChild(btn);
  });

  renderChatHistoryForActiveCapsule();

  if (autoSpeak) {
    speakAndWriteCapsule(capsule);
  }
}

renderCapsuleLists();
if (activeCapsule) {
  loadCapsuleIntoUserPortal(activeCapsule, false);
}

// ============================================================================
// 6. VINTAGE MEMORY REEL CANVAS ANIMATOR (Ken Burns + Sarvam Sepia Aesthetic)
// ============================================================================
const canvas = document.getElementById("memoryCanvas");
const ctx = canvas.getContext("2d");
let animTick = 0;

function renderMemoryCanvas() {
  animTick += 0.005;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (activeReelImages.length > 0) {
    const slideDuration = 4.5;
    const totalIndex = Math.floor(animTick / slideDuration);
    const img = activeReelImages[totalIndex % activeReelImages.length];
    const progress = (animTick % slideDuration) / slideDuration;
    const scale = 1.04 + progress * 0.12;

    const iw = img.width || w;
    const ih = img.height || h;
    const ratio = Math.max(w / iw, h / ih) * scale;
    const nw = iw * ratio;
    const nh = ih * ratio;
    const ox = (w - nw) / 2 + Math.sin(animTick) * 12;
    const oy = (h - nh) / 2 + Math.cos(animTick * 0.8) * 8;

    ctx.save();
    ctx.filter = "sepia(22%) contrast(104%) brightness(96%)";
    ctx.drawImage(img, ox, oy, nw, nh);
    ctx.restore();
  } else {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#121A2D");
    grad.addColorStop(0.5, "#3E2D42");
    grad.addColorStop(1, "#C95631");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const sunY = h * 0.54 + Math.sin(animTick * 0.7) * 6;
    const radial = ctx.createRadialGradient(
      w * 0.5,
      sunY,
      10,
      w * 0.5,
      sunY,
      220
    );
    radial.addColorStop(0, "rgba(255, 224, 170, 0.5)");
    radial.addColorStop(0.5, "rgba(228, 99, 58, 0.2)");
    radial.addColorStop(1, "rgba(18, 26, 45, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(12, 16, 26, 0.62)";
    ctx.fillRect(0, h - 56, w, 56);

    ctx.strokeStyle = "rgba(255, 244, 224, 0.25)";
    ctx.fillStyle = "rgba(255, 232, 185, 0.48)";
    for (let i = 0; i < 30; i++) {
      const x = (i * 97 + animTick * 40) % w;
      const y =
        (i * 53 +
          animTick * (activeSoundscape === "monsoon" ? 190 : 35)) %
        h;
      if (activeSoundscape === "monsoon") {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 4, y + 14);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, (i % 3) + 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const vig = ctx.createRadialGradient(
    w / 2,
    h / 2,
    h * 0.35,
    w / 2,
    h / 2,
    w * 0.65
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(10, 14, 24, 0.52)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  requestAnimationFrame(renderMemoryCanvas);
}
requestAnimationFrame(renderMemoryCanvas);

// ============================================================================
// 7. PHOTO UPLOAD, DRAG & DROP, AND CLIPBOARD PASTE (Ctrl+V)
// ============================================================================
const uploadZone = document.getElementById("uploadZone");
const photoInput = document.getElementById("photoInput");
const photoThumbs = document.getElementById("photoThumbs");
const pasteClipboardBtn = document.getElementById("pasteClipboardBtn");
const clearPhotosBtn = document.getElementById("clearPhotosBtn");

function renderPhotoThumbnails() {
  photoThumbs.innerHTML = "";
  clearPhotosBtn.hidden = stagedPhotoDataUrls.length === 0;

  stagedPhotoDataUrls.forEach((dataUrl, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "thumb-wrap";

    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = `Childhood photo ${idx + 1}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "thumb-remove-btn";
    removeBtn.title = "Remove photo";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      stagedPhotoDataUrls.splice(idx, 1);
      renderPhotoThumbnails();
      syncActiveReelImages(stagedPhotoDataUrls);
    });

    wrap.appendChild(img);
    wrap.appendChild(removeBtn);
    photoThumbs.appendChild(wrap);
  });

  syncActiveReelImages(stagedPhotoDataUrls);
}

function addImageFilesOrBlobs(blobs) {
  const validBlobs = Array.from(blobs || []).filter(
    (b) => b && b.type && b.type.startsWith("image/")
  );
  if (validBlobs.length === 0) return false;

  validBlobs.forEach((blob) => {
    if (stagedPhotoDataUrls.length >= 8) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (stagedPhotoDataUrls.length < 8) {
        stagedPhotoDataUrls.push(ev.target.result);
        renderPhotoThumbnails();
      }
    };
    reader.readAsDataURL(blob);
  });
  return true;
}

uploadZone.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", (e) => {
  addImageFilesOrBlobs(e.target.files);
  photoInput.value = "";
});

// Drag & Drop support on Upload Zone
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("drag-over");
});
uploadZone.addEventListener("dragleave", () => {
  uploadZone.classList.remove("drag-over");
});
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("drag-over");
  if (e.dataTransfer?.files?.length) {
    addImageFilesOrBlobs(e.dataTransfer.files);
  }
});

// Global Ctrl+V / Cmd+V Clipboard Image Paste anywhere on page
window.addEventListener("paste", (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  const imageBlobs = [];
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) imageBlobs.push(file);
    }
  }
  if (imageBlobs.length > 0) {
    addImageFilesOrBlobs(imageBlobs);
    const studioStatus = document.getElementById("studioStatus");
    if (studioStatus) {
      studioStatus.textContent = `✦ Pasted ${imageBlobs.length} image(s) from clipboard into Memory Reel!`;
    }
  }
});

// Explicit "📋 Paste Image" button using Async Clipboard API
pasteClipboardBtn.addEventListener("click", async () => {
  const studioStatus = document.getElementById("studioStatus");
  try {
    if (!navigator.clipboard?.read) {
      studioStatus.textContent =
        "Press Ctrl+V (or Cmd+V) anywhere on the page to paste your copied image.";
      return;
    }
    const clipboardItems = await navigator.clipboard.read();
    const blobs = [];
    for (const item of clipboardItems) {
      const imgType = item.types.find((t) => t.startsWith("image/"));
      if (imgType) {
        const blob = await item.getType(imgType);
        blobs.push(blob);
      }
    }
    if (blobs.length > 0) {
      addImageFilesOrBlobs(blobs);
      studioStatus.textContent = `✦ Pasted ${blobs.length} image(s) from clipboard!`;
    } else {
      studioStatus.textContent =
        "No image found in clipboard. Copy an image first or press Ctrl+V.";
    }
  } catch {
    studioStatus.textContent =
      "Tip: Press Ctrl+V (or Cmd+V) directly on the page to paste an image from your clipboard.";
  }
});

clearPhotosBtn.addEventListener("click", () => {
  stagedPhotoDataUrls = [];
  renderPhotoThumbnails();
});

// ============================================================================
// 8. UI CONTROLS, FORM SUBMISSION & LIVE-WRITING COMPANION CHAT
// ============================================================================
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
  } else if (activeCapsule) {
    speakAndWriteCapsule(activeCapsule);
  }
});

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

document.querySelectorAll(".size-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const container = document.getElementById("storyContainer");
    container.className = `live-writer-column size-${btn.dataset.size}`;
  });
});

// Family Studio Form Submit -> Generate via Sarvam AI & Handoff to User Portal!
document.getElementById("memory-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const generateBtn = document.getElementById("generateBtn");
  const generateBtnText = document.getElementById("generateBtnText");
  const studioStatus = document.getElementById("studioStatus");

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
  studioStatus.textContent =
    "✦ Calling sarvam-105b-conversations → sarvam-translate:v1 → bulbul:v4-flash…";

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

    const newCapsule = {
      id: `cap-${Date.now()}`,
      parentName: payload.parentName,
      era: payload.era,
      hometown: payload.hometown,
      language: data.language,
      languageLabel: data.languageLabel,
      speaker: data.speaker,
      sound: activeSoundscape,
      title: data.title,
      nativeStory: data.nativeStory,
      englishStory: data.englishStory,
      nativeQuestions: data.nativeQuestions || [],
      recallQuestions: data.recallQuestions || [],
      videoPrompt: data.videoPrompt,
      audioClips: data.audioClips || [],
      audioSegments: data.audioSegments || [],
      chatMessages: [],
      photoDataUrls: [...stagedPhotoDataUrls],
    };

    capsules.unshift(newCapsule);
    activeCapsule = newCapsule;
    persistCapsules();
    renderCapsuleLists();

    studioStatus.textContent =
      "✦ Memory capsule created! Opening User / Parent Portal…";

    switchPortal("user");
    loadCapsuleIntoUserPortal(newCapsule, true);
  } catch (err) {
    studioStatus.textContent = `Error: ${err.message}`;
  } finally {
    generateBtn.disabled = false;
    generateBtnText.textContent =
      "Create Memory & Launch in Parent Portal →";
  }
});

// Interactive Companion Chat
async function sendCompanionMessage(userText) {
  if (!userText.trim() || !activeCapsule) return;
  if (!activeCapsule.chatMessages) activeCapsule.chatMessages = [];

  const input = document.getElementById("companionInput");
  input.value = "";

  const userMsgObj = { role: "user", content: userText };
  activeCapsule.chatMessages.push(userMsgObj);
  appendChatBubbleToDOM(userMsgObj);

  const chatLog = document.getElementById("chatLog");
  const loadingBubble = document.createElement("div");
  loadingBubble.className = "chat-bubble assistant";
  loadingBubble.textContent = "Smriti is listening warmly…";
  chatLog.appendChild(loadingBubble);
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const res = await fetch("/api/chat-companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentName: activeCapsule?.parentName || "Maa",
        storyContext: activeCapsule?.englishStory || "",
        language: activeCapsule?.language || "hi-IN",
        speaker: activeCapsule?.speaker || "ritu",
        pace: parseFloat(document.getElementById("pace").value || "0.88"),
        messages: activeCapsule.chatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || "Companion error");
    }

    loadingBubble.remove();

    const assistantMsgObj = {
      role: "assistant",
      content: data.reply,
      audioClips: data.audioClips || [],
      audioSegments: data.audioSegments || [],
    };
    activeCapsule.chatMessages.push(assistantMsgObj);
    persistCapsules();
    appendChatBubbleToDOM(assistantMsgObj);

    await speakAndWriteCapsule({
      ...activeCapsule,
      nativeStory: assistantMsgObj.content,
      audioClips: assistantMsgObj.audioClips,
      audioSegments: assistantMsgObj.audioSegments,
    });
  } catch (err) {
    loadingBubble.textContent = `Could not reach Smriti: ${err.message}`;
  }
}

document.getElementById("companionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("companionInput");
  sendCompanionMessage(input.value);
});

// Web Speech API Microphone Input
const micBtn = document.getElementById("micBtn");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    recognition.lang = activeCapsule?.language || "hi-IN";
    micBtn.textContent = "🔴 Listening…";
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    document.getElementById("companionInput").value = transcript;
    micBtn.textContent = "🎙️ Speak";
  };

  recognition.onerror = () => {
    micBtn.textContent = "🎙️ Speak";
  };
  recognition.onend = () => {
    micBtn.textContent = "🎙️ Speak";
  };
} else {
  micBtn.style.display = "none";
}
