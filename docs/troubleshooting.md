# Troubleshooting Guide

Common issues and their solutions.

## 🔍 Quick Diagnostics

### Check Backend Status

```bash
curl http://localhost:8000/
```

Expected: `{"message":"MedBot API is running","status":"healthy","whisper_model":"base"}`

### Check Backend Logs

```bash
tail -f medbot-api/server.log
```

### Check Environment Variables

```bash
cd medbot-api
cat .env
```

Should show both tokens without quotes.

---

## 🐛 Common Issues

### Backend Issues

#### Issue: Port 8000 Already in Use

**Symptoms:**
```
ERROR: [Errno 48] error while attempting to bind on address ('0.0.0.0', 8000): address already in use
```

**Solution:**
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Restart server
cd medbot-api && python3 index.py
```

---

#### Issue: "Speaker diarization is not available"

**Symptoms:**
- Error 503 when calling `/transcribe/diarize`
- Warning in logs: "HUGGINGFACE_TOKEN not found"

**Solutions:**

1. **Check .env file exists:**
```bash
ls medbot-api/.env
```

2. **Check token format (NO QUOTES):**
```bash
cat medbot-api/.env
```
Should be: `HUGGINGFACE_TOKEN=hf_abc123` (no quotes)

3. **Accept model terms:**
- Visit https://huggingface.co/pyannote/speaker-diarization-3.1
- Click "Agree and access repository"
- Visit https://huggingface.co/pyannote/segmentation-3.0
- Click "Agree and access repository"
- Wait 2-3 minutes

4. **Restart server:**
```bash
lsof -ti:8000 | xargs kill -9
cd medbot-api && python3 index.py
```

---

#### Issue: "Format not recognised" Error

**Symptoms:**
```
Error opening '.../tmp....webm': Format not recognised
```

**Solution:**

Already fixed in latest version! The backend now automatically converts WebM to WAV.

If still seeing this:
1. Update to latest code
2. Ensure ffmpeg is installed: `ffmpeg -version`
3. Restart backend server

---

#### Issue: "DO_AI_API_KEY not configured"

**Symptoms:**
- Clinical note generation fails
- Error: "DO_AI_API_KEY not configured in environment"

**Solution:**

1. **Add key to .env:**
```bash
echo "DO_AI_API_KEY=your_key_here" >> medbot-api/.env
```

2. **Verify (NO QUOTES):**
```bash
cat medbot-api/.env | grep DO_AI
```

3. **Restart server:**
```bash
lsof -ti:8000 | xargs kill -9
cd medbot-api && python3 index.py
```

---

#### Issue: Module Not Found Errors

**Symptoms:**
```
ModuleNotFoundError: No module named 'whisper'
```

**Solution:**

1. **Activate virtual environment:**
```bash
cd medbot-api
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows
```

2. **Reinstall requirements:**
```bash
pip install -r requirements.txt
```

3. **Verify installation:**
```bash
pip list | grep whisper
```

---

#### Issue: ffmpeg Not Found

**Symptoms:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'ffmpeg'
```

**Solution:**

```bash
# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

---

### Frontend Issues

#### Issue: Port 3000 Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Restart frontend
cd medbot-frontend && npm run dev
```

---

#### Issue: "Failed to transcribe audio"

**Symptoms:**
- Alert: "Failed to transcribe audio"
- No transcript appears

**Solutions:**

1. **Check backend is running:**
```bash
curl http://localhost:8000/
```

2. **Check browser console** (F12):
- Look for CORS errors
- Check network tab for failed requests

3. **Verify microphone permissions:**
- Check browser settings
- Allow microphone access

4. **Check backend logs:**
```bash
tail -f medbot-api/server.log
```

---

#### Issue: No Audio Detected

**Symptoms:**
- Audio level indicator shows no activity
- Recording completes but transcription is empty

**Solutions:**

1. **Check microphone:**
- System settings → Sound → Input
- Ensure correct microphone selected
- Test microphone in system preferences

2. **Browser permissions:**
- Check site permissions
- Click padlock icon in address bar
- Ensure microphone is "Allow"

3. **Try different browser:**
- Chrome (recommended)
- Edge
- Firefox

4. **Refresh page:**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

#### Issue: "Cannot connect to API"

**Symptoms:**
- CORS errors in console
- Network request failures

**Solutions:**

1. **Check backend is running:**
```bash
curl http://localhost:8000/
```

2. **Check URL in frontend code:**
Should be `http://localhost:8000`

3. **Check browser console:**
Look for specific error messages

4. **Disable browser extensions:**
- Ad blockers
- Privacy tools
- Try incognito mode

---

### Recording Issues

#### Issue: Recording Too Short

**Symptoms:**
- "Uploaded file is empty" error
- Transcription fails immediately

**Solution:**

Record for at least 2-3 seconds. Very short recordings may fail.

---

#### Issue: No Speaker Labels

**Symptoms:**
- Transcript appears but no "Person 1", "Person 2" labels
- All text shown as single block

**Possible Causes:**

1. **Only one speaker detected:**
- Normal behavior for single speaker
- System won't show labels for one person

2. **Diarization not available:**
- Check HUGGINGFACE_TOKEN is set
- Verify model terms accepted
- Falls back to simple transcription

3. **Speakers too similar:**
- Voices sound very similar
- System can't differentiate
- Try more distinct speakers

---

### Model Loading Issues

#### Issue: Models Download Slowly

**Symptoms:**
- First startup takes very long
- "Downloading model..." messages

**Solution:**

This is normal on first run!
- Whisper base model: ~150MB
- Pyannote models: ~100MB each
- Be patient, only happens once

---

#### Issue: "Could not download pipeline"

**Symptoms:**
```
Could not download 'pyannote/speaker-diarization-3.1' pipeline.
```

**Solutions:**

1. **Check internet connection**

2. **Accept model terms:**
- https://huggingface.co/pyannote/speaker-diarization-3.1
- https://huggingface.co/pyannote/segmentation-3.0

3. **Wait 2-3 minutes after accepting**

4. **Check HuggingFace status:**
- https://status.huggingface.co/

5. **Try a different network:**
- Corporate networks may block downloads
- Try home/mobile network

---

## 🔧 Advanced Troubleshooting

### Enable Debug Mode

```bash
# Add to .env
DEBUG=True

# Restart backend
lsof -ti:8000 | xargs kill -9
cd medbot-api && python3 index.py
```

### View Detailed Logs

```bash
# Watch logs in real-time
tail -f medbot-api/server.log

# View last 100 lines
tail -100 medbot-api/server.log

# Search for errors
grep ERROR medbot-api/server.log
```

### Test Individual Components

```bash
# Test Whisper directly
python3 -c "import whisper; model = whisper.load_model('base'); print('OK')"

# Test pyannote
python3 -c "from pyannote.audio import Pipeline; print('OK')"

# Test requests
python3 -c "import requests; print('OK')"
```

### Check Python Version

```bash
python3 --version
# Should be 3.9 or higher
```

### Check Node Version

```bash
node --version
# Should be 18.0 or higher

npm --version
# Should be 8.0 or higher
```

### Reinstall Everything

```bash
# Backend
cd medbot-api
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../medbot-frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Performance Issues

### Issue: Slow Transcription

**Possible Causes:**
- Long audio files
- Low system resources
- First-time model loading

**Solutions:**
- Keep recordings under 10 minutes
- Close other applications
- Wait for first-time model downloads to complete
- Consider using smaller Whisper model (tiny)

### Issue: High CPU Usage

**Normal Behavior:**
- Whisper is CPU-intensive
- 100% CPU usage during transcription is normal
- Returns to normal after processing

**If Persistent:**
- Check for stuck processes: `ps aux | grep python`
- Kill hung processes
- Restart server

---

## 🆘 Still Having Issues?

### Collect Information

1. **System info:**
```bash
uname -a  # OS version
python3 --version
node --version
ffmpeg -version
```

2. **Backend logs:**
```bash
tail -50 medbot-api/server.log
```

3. **Browser console:**
- Open DevTools (F12)
- Copy errors from Console tab
- Check Network tab for failed requests

4. **Environment:**
```bash
cat medbot-api/.env | sed 's/hf_[^ ]*/hf_HIDDEN/g' | sed 's/sk-[^ ]*/sk-HIDDEN/g'
```

### Reset Everything

```bash
# Stop all processes
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Clear temporary files
rm -f medbot-api/*.log
rm -rf medbot-api/__pycache__

# Restart from scratch
cd medbot-api && python3 index.py &
cd medbot-frontend && npm run dev
```

---

## 📚 Additional Resources

- [Installation Guide](./installation.md)
- [Quick Start](./quickstart.md)
- [API Documentation](./api/overview.md)
- [FAQ](./faq.md)

---

## 💡 Prevention Tips

1. **Always check .env format** - No quotes around values
2. **Accept model terms first** - Before starting backend
3. **Keep software updated** - Latest Python, Node, ffmpeg
4. **Use recommended browsers** - Chrome or Edge
5. **Test with short recordings first** - Verify setup works
6. **Monitor logs** - Watch for warnings during startup
7. **Backup .env file** - Keep API keys safe

---

**Still stuck?** Check the [FAQ](./faq.md) for more answers!

