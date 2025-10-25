# Configuration Guide

Complete guide to configuring MedBot for your needs.

## 📁 Configuration Files

### Backend Configuration

**File:** `medbot-api/.env`

```bash
# HuggingFace Token for Speaker Diarization
HUGGINGFACE_TOKEN=hf_yourtoken

# DigitalOcean AI API Key for Clinical Note Generation
DO_AI_API_KEY=sk-do-yourkey
```

**Important Rules:**
- ❌ No quotes around values
- ❌ No spaces around `=`
- ✅ One variable per line
- ✅ Use actual values, not placeholders

---

## 🔑 API Keys Setup

### HuggingFace Token

**Purpose:** Required for speaker diarization models

**How to Get:**

1. **Create Account**
   - Visit https://huggingface.co/join
   - Sign up (free)

2. **Generate Token**
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Name: "medbot" (or any name)
   - Type: "Read"
   - Click "Generate"
   - Copy the token (starts with `hf_`)

3. **Accept Model Terms**
   - Visit https://huggingface.co/pyannote/speaker-diarization-3.1
   - Click "Agree and access repository"
   - Visit https://huggingface.co/pyannote/segmentation-3.0
   - Click "Agree and access repository"
   - **Wait 2-3 minutes** for permissions to propagate

4. **Add to .env**
   ```bash
   HUGGINGFACE_TOKEN=hf_abc123xyz...
   ```

### DigitalOcean AI API Key

**Purpose:** Required for clinical note generation

**How to Get:**

1. Visit DigitalOcean AI platform
2. Create/login to account
3. Generate API key
4. Copy key (starts with `sk-do-`)

**Add to .env:**
```bash
DO_AI_API_KEY=sk-do-abc123...
```

---

## ⚙️ Backend Configuration

### Whisper Model Selection

**File:** `medbot-api/index.py`

**Default:** `base` model

**Available Models:**

| Model | Size | Speed | Accuracy | Use Case |
|-------|------|-------|----------|----------|
| `tiny` | 75 MB | Fastest | Lowest | Quick testing |
| `base` | 150 MB | Fast | Good | **Recommended** |
| `small` | 500 MB | Medium | Better | Higher accuracy needed |
| `medium` | 1.5 GB | Slow | High | Professional use |
| `large` | 3 GB | Slowest | Highest | Maximum accuracy |

**Change Model:**

```python
# Find this line in index.py:
model = whisper.load_model("base")

# Change to:
model = whisper.load_model("small")  # or tiny, medium, large
```

**Considerations:**
- Larger models = better accuracy but slower
- Smaller models = faster but less accurate
- `base` is good balance for most uses

### Server Configuration

**Port Configuration:**

```python
# In index.py, at the bottom:
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
# Change port if needed:
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

**CORS Configuration:**

```python
# Find this section in index.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development: Allow all
    # allow_origins=["http://localhost:3000"],  # Production: Specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For Production:**
- Change `allow_origins=["*"]` to specific domain
- Example: `allow_origins=["https://yourdomain.com"]`

---

## 🎨 Frontend Configuration

### API Endpoint Configuration

**Files to Update:**
- `medbot-frontend/components/VoiceRecorder.tsx`
- `medbot-frontend/components/TranscriptDisplay.tsx`

**Default:** `http://localhost:8000`

**Change for Production:**

```typescript
// Find lines like:
const response = await axios.post("http://localhost:8000/transcribe/diarize", ...)

// Change to:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const response = await axios.post(`${API_BASE_URL}/transcribe/diarize`, ...)
```

**Environment Variable:**

Create `medbot-frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Port Configuration

**File:** `medbot-frontend/package.json`

**Default:** Port 3000

**Change Port:**

```json
{
  "scripts": {
    "dev": "next dev -p 3001",  // Change to port 3001
    "build": "next build",
    "start": "next start -p 3001"
  }
}
```

Or use command line:
```bash
npm run dev -- -p 3001
```

---

## 🤖 AI Model Configuration

### Clinical Note System Prompt

**File:** `medbot-api/index.py`

**Location:** In `generate_clinical_note` function

**Customize for Your Specialty:**

```python
system_prompt = """You are a medical documentation assistant specializing in [YOUR SPECIALTY].

Generate a structured clinical note following the [YOUR FORMAT] format...

[YOUR SPECIFIC INSTRUCTIONS]
"""
```

**Examples:**

**For Orthopedics (Current):**
```python
system_prompt = """...specializing in orthopedic consultations..."""
```

**For General Practice:**
```python
system_prompt = """You are a medical documentation assistant for general practice.
Include: Chief Complaint, History of Present Illness, Review of Systems, 
Physical Exam, Assessment, and Plan."""
```

**For Psychiatry:**
```python
system_prompt = """You are a mental health documentation assistant.
Include: Chief Complaint, History of Present Illness, Mental Status Exam,
Risk Assessment, Diagnosis, and Treatment Plan."""
```

### AI Model Parameters

**Temperature Setting:**

```python
payload = {
    "model": "openai-gpt-oss-20b",
    "messages": [...],
    "max_tokens": 2000,
    "temperature": 0.3  # Lower = more consistent, Higher = more creative
}
```

**Temperature Guide:**
- `0.0-0.3`: Consistent, factual (recommended for medical)
- `0.4-0.7`: Balanced
- `0.8-1.0`: Creative, varied

**Max Tokens:**
- Current: 2000 (suitable for most notes)
- Increase for longer consultations
- Decrease to save costs

---

## 🎤 Audio Configuration

### Recording Quality

**Browser Settings:**

Most browsers use default quality settings. For better quality:

**Chrome:**
```javascript
// In VoiceRecorder.tsx, modify MediaRecorder options:
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000  // Higher = better quality
});
```

### Supported Formats

Backend automatically handles:
- WAV (preferred for diarization)
- MP3
- MP4/M4A  
- WebM (browser default)
- OGG

No configuration needed - conversion is automatic!

---

## 📊 Performance Tuning

### Backend Performance

**Workers Configuration:**

```bash
# For production, use multiple workers:
uvicorn index:app --host 0.0.0.0 --port 8000 --workers 4
```

**Memory Management:**

```python
# Add to index.py if memory is limited:
import gc

@app.post("/transcribe/diarize")
async def transcribe_audio_diarize(...):
    # ... processing ...
    gc.collect()  # Force garbage collection
    return result
```

### Frontend Performance

**Build Optimization:**

```bash
# Production build
npm run build
npm run start
```

**Image Optimization:** (if you add images)

```typescript
// Use Next.js Image component
import Image from 'next/image'
```

---

## 🔐 Security Configuration

### API Key Security

**DO NOT:**
- ❌ Commit `.env` to git
- ❌ Share API keys publicly
- ❌ Hard-code keys in source

**DO:**
- ✅ Use `.env` files
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables
- ✅ Rotate keys regularly

### Production Security

```python
# Add authentication middleware
from fastapi import Header, HTTPException

async def verify_api_key(x_api_key: str = Header()):
    if x_api_key != os.getenv("API_SECRET_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API Key")

# Apply to routes:
@app.post("/transcribe/diarize", dependencies=[Depends(verify_api_key)])
```

---

## 📝 Logging Configuration

### Enable Debug Logging

**Add to `index.py`:**

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Change to INFO for production
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("medbot.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Use in code:
logger.debug("Processing audio file...")
logger.info("Transcription complete")
logger.error("Error occurred: ...")
```

### Log Rotation

```python
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    "medbot.log",
    maxBytes=10485760,  # 10MB
    backupCount=5
)
```

---

## 🌍 Multi-Language Support

### Whisper Language

**Auto-detect (default):**
```python
result = model.transcribe(audio_path)  # Auto-detects language
```

**Force Specific Language:**
```python
result = model.transcribe(audio_path, language="es")  # Spanish
result = model.transcribe(audio_path, language="fr")  # French
result = model.transcribe(audio_path, language="de")  # German
```

**Supported Languages:** 90+ including:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `zh` - Chinese
- `ja` - Japanese
- And many more!

---

## 🔄 Environment-Specific Configuration

### Development

```bash
# .env.development
HUGGINGFACE_TOKEN=hf_dev_token
DO_AI_API_KEY=sk-do-dev-key
DEBUG=True
LOG_LEVEL=DEBUG
```

### Production

```bash
# .env.production
HUGGINGFACE_TOKEN=hf_prod_token
DO_AI_API_KEY=sk-do-prod-key
DEBUG=False
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://yourdomain.com
```

**Load based on environment:**

```python
import os
from dotenv import load_dotenv

env = os.getenv("ENV", "development")
load_dotenv(f".env.{env}")
```

---

## ✅ Configuration Checklist

Before deploying, verify:

- [ ] All API keys configured in `.env`
- [ ] `.env` added to `.gitignore`
- [ ] HuggingFace model terms accepted
- [ ] CORS origins restricted (production)
- [ ] Appropriate Whisper model selected
- [ ] Logging configured
- [ ] Error handling in place
- [ ] Security measures implemented
- [ ] Performance settings optimized
- [ ] Environment-specific configs ready

---

## 🆘 Configuration Issues?

**Token not working:**
- Check format (no quotes!)
- Verify token is valid
- Ensure model terms accepted
- Restart server after changes

**Port conflicts:**
- Change port in configuration
- Kill existing processes
- Use different port number

**CORS errors:**
- Check `allow_origins` setting
- Verify frontend URL matches
- Check browser console

---

## 📚 Related Documentation

- [Installation Guide](./installation.md)
- [Troubleshooting](./troubleshooting.md)
- [API Documentation](./api/overview.md)
- [Deployment Guide](./deployment/production.md)

---

**Need help?** Check our [FAQ](./faq.md) or [Troubleshooting Guide](./troubleshooting.md)!

