# 🪷 Smriti (स्मृति · ସ୍ମୃତି · স্মৃতি)
### Sovereign Indian Language Reminiscence Therapy for Dementia Care — Powered by Sarvam AI

**Smriti** is a web portal built for families and students caring for parents or grandparents living with dementia. A family member can write a brief childhood memory in English and upload old family photographs; **Smriti** weaves it into a soothing, sensory-rich narrative, translates it into the parent's native Indian language, and narrates it aloud using **Sarvam AI's expressive voices** layered over therapeutic childhood soundscapes—while writing every word live on screen as it speaks.

---

## ✨ Key Features

### 1. Two Dedicated Portals
* **👨‍👩‍👧 Family Member Portal (Memory Studio & Capsule Builder)**
  * Enter a brief childhood memory in English (or choose from nostalgic Indian presets like *1970s Monsoon Courtyard*, *1960s Meter-Gauge Summer Train*, or *1980s Sunday Haveli Kitchen*).
  * Select from **10+ Indian languages** (`hi-IN`, `od-IN`, `bn-IN`, `ta-IN`, `te-IN`, `mr-IN`, `gu-IN`, `kn-IN`, `ml-IN`, `pa-IN`).
  * Customize **Sarvam `bulbul:v4-flash` voice personas** (`ritu_hi_customer_warm`, `simran_en_therapist`, `roopa_hi_companion`, `ishita_en_stories`, `shubh_en_narration_gentle`, `ratan_hi_latenight_warm`, `kabir_hi_conversational`) and slower dementia-friendly speech pacing (`0.75x` – `1.05x`).
  * Upload family/childhood photographs to animate them into a vintage **Ken-Burns Memory Reel** alongside an auto-generated **Google Gemini Video / Veo** scene prompt.
  * Curate and launch saved **Memory Capsules** directly into the Parent Portal.

* **🪷 User / Parent Portal (Elder Reminiscence Sanctuary)**
  * **Big Live-Writing Story Stage Card ("Writes as it Speaks"):** A theatrical, high-contrast story card with an animated 12-bar voice waveform visualizer and live progress bar that highlights and writes each native-script word in real time synchronized with `bulbul:v4-flash` audio playback.
  * **Procedural Web-Audio Childhood Soundscapes:** Real-time browser-synthesized *Courtyard Monsoon Rain*, *Morning Tanpura Sa-Pa Drone*, *Evening Aarti Brass Bell*, and *Meter-Gauge Train Cadence* mixed gently underneath the voice narration.
  * **Interactive Voice & Chat Companion (`sarvam-105b-conversations`):** Gentle, non-corrective recall prompts where the parent can speak or type in their mother tongue and hear Smriti respond warmly aloud.

### 2. Sarvam AI Design System
* Built with a **Sarvam Sovereign Dark Theme** (`#0B0F19` obsidian indigo, `#E4633A` earthen terracotta, sandalwood-ivory typography, and Indigo-to-Terracotta continuum gradients) plus a 1-click **Warm Parchment Light Mode** toggle and dementia-accessible font sizing (`A` / `A+` / `A++`).

---

## 🧠 Sarvam AI APIs & Models Used

| Capability | Sarvam Model | Endpoint | Role in Smriti |
| :--- | :--- | :--- | :--- |
| **Empathetic Story Weaving & Multi-Turn Companion** | `sarvam-105b-conversations` | `POST /v1/chat/completions` | Expands brief family notes into sensory second-person reminiscence stories, recall prompts, and live conversational replies. |
| **Native Indian Script Translation** | `sarvam-translate:v1` | `POST /translate` | Translates the story and recall prompts into the parent's mother tongue across Indian languages. |
| **Expressive Voice Narration** | `bulbul:v4-flash` | `POST /text-to-speech` | Synthesizes natural, unhurried Indian voice segments paired with word-by-word live writing on the story stage card. |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/Satya-Siba-Nayak/Reminiscence-therapy-sarvam.git
cd Reminiscence-therapy-sarvam
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```env
SARVAM_API_KEY=your_sarvam_api_subscription_key
```

### 3. Verify Your Sarvam API Connection (CLI Test)
```bash
npm start
```
Runs `index.js` using `sarvam-105b-conversations` and prints a warm greeting in the terminal.

### 4. Launch the Smriti Web Portal
```bash
npm run web
```
Open **`http://localhost:3000`** in your browser.

---

## ☁️ Deploying to Cloudflare Workers

Smriti is pre-configured for **Cloudflare Workers with Static Assets** via [`wrangler.jsonc`](./wrangler.jsonc) and [`worker.js`](./worker.js).

```bash
# 1. Authenticate with Cloudflare
npx wrangler login

# 2. Deploy static assets + API worker globally
npm run cf:deploy

# 3. Add your Sarvam API key as a production secret
npx wrangler secret put SARVAM_API_KEY
```

---

## 📁 Project Structure

```text
├── public/
│   ├── index.html      # Two-Portal UI (Family Studio + Elder Sanctuary & Big Live Writer Card)
│   ├── styles.css      # Sarvam AI Dark & Warm Parchment Light Design System
│   └── app.js          # Synchronized "Writes as it Speaks" engine, Web Audio soundscapes & Canvas reel
├── index.js            # Minimal standalone Sarvam SDK (sarvam-105b-conversations) CLI verification script
├── worker.js           # Cloudflare Worker backend (/api/generate-session, /api/chat-companion)
├── server.js           # Zero-dependency local Node.js dev server wrapping worker.js
├── wrangler.jsonc      # Cloudflare Workers + Static Assets configuration
└── package.json
```
