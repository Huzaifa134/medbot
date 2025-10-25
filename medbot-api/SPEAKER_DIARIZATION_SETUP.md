# Speaker Diarization Setup Guide

## Overview
Your MedBot API now supports speaker diarization! This feature can identify different speakers in audio recordings and label them as "Person 1", "Person 2", etc.

## Quick Start

### Step 1: Get a HuggingFace Token

1. Go to [HuggingFace Token Settings](https://huggingface.co/settings/tokens)
2. Create a new token (or copy an existing one)
3. Accept the user agreement at: [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1)

### Step 2: Set Up Your Token

**Option A: Using the setup script**
```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
./setup_token.sh
```

**Option B: Manual setup**
```bash
export HUGGINGFACE_TOKEN="your_token_here"
```

To make it permanent, add to your `~/.zshrc` or `~/.bashrc`:
```bash
echo 'export HUGGINGFACE_TOKEN="your_token_here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Start the Server

```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
export HUGGINGFACE_TOKEN="your_token_here"  # if not permanently set
python3 index.py
```

## API Endpoints

### 1. Simple Transcription (No Diarization)
```bash
POST http://localhost:8000/transcribe/simple
```
Returns just the transcribed text.

### 2. Full Transcription (No Diarization)
```bash
POST http://localhost:8000/transcribe
```
Returns transcription with segments, timestamps, and language detection.

### 3. Transcription with Speaker Diarization (NEW!)
```bash
POST http://localhost:8000/transcribe/diarize
```

**Response Format:**
```json
{
  "success": true,
  "filename": "recording.wav",
  "full_text": "Complete transcription...",
  "formatted_transcript": "Person 1: Hello\n\nPerson 2: Hi there...",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello",
      "speaker": "Person 1"
    },
    {
      "start": 2.8,
      "end": 5.3,
      "text": "Hi there",
      "speaker": "Person 2"
    }
  ],
  "num_speakers": 2,
  "speakers": ["Person 1", "Person 2"]
}
```

## Testing

You can test the diarization endpoint using curl:

```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_audio_file.wav"
```

## Troubleshooting

### "Speaker diarization is not available" Error
- Make sure you've set the `HUGGINGFACE_TOKEN` environment variable
- Check that you've accepted the user agreement for the pyannote model
- Restart your server after setting the token

### Token Not Working
- Verify the token is valid at https://huggingface.co/settings/tokens
- Make sure you've accepted the model agreement
- Check that the token has read permissions

### Model Loading Issues
- The first time you run the server with diarization, it will download the model (may take a few minutes)
- Ensure you have a stable internet connection
- Check disk space (models can be several GB)

## Performance Notes

- Speaker diarization is more computationally intensive than simple transcription
- Processing time depends on audio length and number of speakers
- For best results, use clear audio with minimal background noise
- Works best with 2-5 speakers; more speakers may be less accurate

## Integration with Frontend

To use the diarization endpoint in your frontend, update your fetch call:

```typescript
const response = await fetch('http://localhost:8000/transcribe/diarize', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.formatted_transcript); // "Person 1: Hello\n\nPerson 2: Hi..."
```

## Need Help?

Check the server logs for detailed error messages. The API will log each step:
- File upload and validation
- Transcription progress
- Diarization progress
- Speaker mapping

Enjoy your enhanced MedBot with speaker identification! 🎙️

