# Fix Your .env File

## ❌ Problem Found

Your `.env` file has quotes around the token value. With `python-dotenv`, these quotes become part of the actual value, making the token invalid.

## 🔧 How to Fix

### Current Format (WRONG):
```bash
HUGGINGFACE_TOKEN="hf_yourtoken"
```

### Correct Format (RIGHT):
```bash
HUGGINGFACE_TOKEN=hf_yourtoken
```

**No quotes needed!**

## 📝 Steps to Fix

### Option 1: Edit the file manually
```bash
nano /Users/mhuzaifa/Desktop/medbot/medbot-api/.env
```
Remove the quotes from around the token value, then save (Ctrl+X, Y, Enter).

### Option 2: Recreate the file
```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
echo "HUGGINGFACE_TOKEN=hf_your_actual_token_here" > .env
```
(Replace `hf_your_actual_token_here` with your real token)

## ✅ Verify It's Fixed

After fixing, restart the server:
```bash
# Stop server
lsof -ti:8000 | xargs kill -9

# Start server
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
python3 index.py
```

You should see:
```
Loading Whisper model...
Whisper model loaded successfully!
Loading speaker diarization model...
Speaker diarization model loaded successfully!  ✅
```

If you still see "WARNING: HUGGINGFACE_TOKEN not found", the format is still wrong.

## 📋 .env File Rules

✅ **DO:**
```bash
HUGGINGFACE_TOKEN=hf_abc123xyz
API_KEY=mykey123
DEBUG=true
```

❌ **DON'T:**
```bash
HUGGINGFACE_TOKEN="hf_abc123xyz"  # No quotes!
API_KEY='mykey123'                # No single quotes!
DEBUG = true                      # No spaces around =
```

## 🎯 Quick Test

Once fixed, test the diarization endpoint:
```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -F "file=@your_audio.wav"
```

Should return speaker-labeled transcript instead of "503 Service Unavailable".

## 💡 Why This Happens

`python-dotenv` loads .env files as-is. If you write:
```
TOKEN="value"
```

Python sees: `TOKEN = '"value"'` (with quotes as part of the string)

The correct way is:
```
TOKEN=value
```

Python sees: `TOKEN = 'value'` (clean!)

---

**Fix this and your speaker diarization will work!** 🚀

