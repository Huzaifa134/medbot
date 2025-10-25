# Quick Start: Setting Up .env File

## ✅ Your API Now Uses .env Files!

Much cleaner than environment variables! Here's how to set it up:

## 🚀 3-Step Setup

### 1️⃣ Create Your .env File

```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
cp .env.example .env
```

### 2️⃣ Get Your HuggingFace Token

**Go to these URLs:**

1. **Create Token**: https://huggingface.co/settings/tokens
   - Click "New token"
   - Give it a name (e.g., "medbot-diarization")
   - Copy the token (starts with `hf_...`)

2. **Accept Model Terms**: https://huggingface.co/pyannote/speaker-diarization-3.1
   - Click "Agree and access repository"

### 3️⃣ Add Token to .env File

**Option A: Using a text editor**
```bash
nano .env
```
Replace `your_token_here` with your actual token:
```
HUGGINGFACE_TOKEN=hf_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```
Save and exit (Ctrl+X, then Y, then Enter)

**Option B: Using a command**
```bash
echo "HUGGINGFACE_TOKEN=hf_your_actual_token_here" > /Users/mhuzaifa/Desktop/medbot/medbot-api/.env
```

## 🎯 Test It!

### Start the Server
```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
python3 index.py
```

### You should see:
```
Loading Whisper model...
Whisper model loaded successfully!
Loading speaker diarization model...
Speaker diarization model loaded successfully!  ✅
```

If you see "WARNING: HUGGINGFACE_TOKEN not found", check your .env file.

## 📝 Example .env File

```env
# Your HuggingFace Token for Speaker Diarization
HUGGINGFACE_TOKEN=hf_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

**That's it!** Just one line.

## 🧪 Test Speaker Diarization

Once the token is set up:

```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -F "file=@your_audio.wav"
```

## 🔒 Security

Your `.env` file is protected:
- ✅ Already in `.gitignore`
- ✅ Won't be committed to git
- ✅ Keep it private!

## 📁 Current File Structure

```
medbot-api/
├── .env              ← Your token goes here (create this)
├── .env.example      ← Template file
├── .gitignore        ← Protects .env
├── index.py          ← Auto-loads .env
└── ENV_SETUP.md      ← Detailed docs
```

## ⚡ Current Status

- ✅ Server is running: http://localhost:8000
- ✅ Basic transcription working
- ⚠️ Speaker diarization: **Needs .env file with token**

## 🆘 Quick Troubleshooting

**"HUGGINGFACE_TOKEN not found"**
→ Create `.env` file in `/Users/mhuzaifa/Desktop/medbot/medbot-api/`

**Token not working**
→ Check for extra spaces, quotes, or newlines in `.env`

**Still having issues?**
→ Check `ENV_SETUP.md` for detailed troubleshooting

---

**Need more help?** See `ENV_SETUP.md` for the complete guide! 📚

