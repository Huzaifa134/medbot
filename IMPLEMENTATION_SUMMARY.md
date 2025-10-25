# MedBot - Speaker Diarization Implementation Summary

## ✅ What's Been Implemented

Your MedBot API now has **speaker diarization** capabilities! The system can:

1. **Transcribe audio** (existing feature - still working)
2. **Identify different speakers** (NEW!)
3. **Label speakers** as Person 1, Person 2, etc. (NEW!)
4. **Create formatted transcripts** with speaker labels (NEW!)

## 🎯 Available API Endpoints

### 1. Simple Transcription
```
POST http://localhost:8000/transcribe/simple
```
- Returns only the transcribed text
- Fast and lightweight
- No speaker identification

### 2. Full Transcription  
```
POST http://localhost:8000/transcribe
```
- Returns detailed transcription with segments
- Includes timestamps, language detection
- No speaker identification

### 3. Transcription with Speaker Diarization (NEW!)
```
POST http://localhost:8000/transcribe/diarize
```
- Transcribes audio AND identifies speakers
- Labels speakers as Person 1, Person 2, etc.
- Returns formatted transcript with speaker labels
- Returns detailed segments with speaker info

## 📋 Current Status

✅ **Working:** Basic transcription endpoints  
✅ **Implemented:** Speaker diarization endpoint  
⚠️ **Requires Setup:** HuggingFace token for diarization  

## 🔧 How to Enable Speaker Diarization

### Quick Setup (3 steps):

1. **Get a HuggingFace Token**
   - Visit: https://huggingface.co/settings/tokens
   - Create a new token (free account is fine)
   
2. **Accept Model Terms**
   - Visit: https://huggingface.co/pyannote/speaker-diarization-3.1
   - Click "Agree and access repository"
   
3. **Set the Token**
   
   **Option A: Use the setup script**
   ```bash
   cd /Users/mhuzaifa/Desktop/medbot/medbot-api
   ./setup_token.sh
   ```
   
   **Option B: Set manually**
   ```bash
   export HUGGINGFACE_TOKEN="your_token_here"
   ```
   
   **Option C: Add to shell profile (permanent)**
   ```bash
   echo 'export HUGGINGFACE_TOKEN="your_token_here"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. **Restart the Server**
   ```bash
   # Stop current server
   lsof -ti:8000 | xargs kill -9
   
   # Start with token
   cd /Users/mhuzaifa/Desktop/medbot/medbot-api
   python3 index.py
   ```

## 🧪 Testing the Diarization

### Using curl:
```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_audio.wav"
```

### Expected Response:
```json
{
  "success": true,
  "filename": "recording.wav",
  "full_text": "Complete transcription of all speech...",
  "formatted_transcript": "Person 1: Hello, how are you?\n\nPerson 2: I'm doing well, thanks!",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello, how are you?",
      "speaker": "Person 1"
    },
    {
      "start": 3.0,
      "end": 5.2,
      "text": "I'm doing well, thanks!",
      "speaker": "Person 2"
    }
  ],
  "num_speakers": 2,
  "speakers": ["Person 1", "Person 2"]
}
```

## 🎨 Frontend Integration

### Update Your Frontend to Use Diarization:

In your `VoiceRecorder.tsx` or API call file:

```typescript
// Change endpoint from /transcribe/simple to /transcribe/diarize
const response = await fetch('http://localhost:8000/transcribe/diarize', {
  method: 'POST',
  body: formData,
});

const data = await response.json();

// Display formatted transcript with speakers
console.log(data.formatted_transcript);
// Output: "Person 1: Hello...\n\nPerson 2: Hi there..."

// Or use individual segments with speaker info
data.segments.forEach(segment => {
  console.log(`${segment.speaker}: ${segment.text}`);
  // Display timestamp: ${segment.start} - ${segment.end}
});
```

## 📊 API Documentation

FastAPI automatically generates interactive docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔍 Current Server Status

Server is running at: `http://localhost:8000`

Check status:
```bash
curl http://localhost:8000/
```

View server logs:
```bash
tail -f /Users/mhuzaifa/Desktop/medbot/medbot-api/server.log
```

## 📁 Files Modified/Created

1. **medbot-api/index.py** - Added diarization pipeline and endpoint
2. **medbot-api/setup_token.sh** - Helper script for token setup
3. **medbot-api/SPEAKER_DIARIZATION_SETUP.md** - Detailed setup guide
4. **medbot-api/requirements.txt** - Already had pyannote.audio

## 🚀 Next Steps

1. **Set up HuggingFace token** (follow steps above)
2. **Restart the server** with the token
3. **Test the diarization endpoint** with an audio file
4. **Update your frontend** to use the new endpoint
5. **Display speaker-labeled transcripts** in your UI

## 💡 Tips for Best Results

- Use clear audio with minimal background noise
- Works best with 2-5 speakers
- Longer audio files will take more time to process
- First run will download the model (may take a few minutes)
- Ensure speakers have distinct voices for better accuracy

## ❓ Troubleshooting

**"Speaker diarization is not available" error**
→ Set the HUGGINGFACE_TOKEN environment variable

**Token not working**
→ Make sure you accepted the model agreement at the URL above

**Slow processing**
→ Diarization is computationally intensive, normal for longer audio

**Need help?**
→ Check server logs: `tail -f medbot-api/server.log`

---

**Server is ready!** Set up your HuggingFace token and you'll be able to identify multiple speakers in your audio recordings! 🎉

