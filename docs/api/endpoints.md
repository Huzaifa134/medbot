# API Endpoints

Detailed documentation for all API endpoints.

## Health Check

### GET `/`

Check if the API server is running and healthy.

**Request:**
```bash
curl http://localhost:8000/
```

**Response:**
```json
{
  "message": "MedBot API is running",
  "status": "healthy",
  "whisper_model": "base"
}
```

**Status Codes:**
- `200`: Server is healthy

---

## Transcription Endpoints

### POST `/transcribe`

Full transcription with detailed information including segments, timestamps, and language detection.

**Request:**
```bash
curl -X POST "http://localhost:8000/transcribe" \
  -F "file=@audio.wav"
```

**Parameters:**
- `file` (required): Audio file to transcribe

**Response:**
```json
{
  "success": true,
  "filename": "audio.wav",
  "transcription": "Complete transcription text here...",
  "language": "en",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 2.5,
      "text": "Hello, how are you?"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid file format
- `500`: Transcription failed

---

### POST `/transcribe/simple`

Simple transcription that returns only the transcribed text.

**Request:**
```bash
curl -X POST "http://localhost:8000/transcribe/simple" \
  -F "file=@audio.wav"
```

**Parameters:**
- `file` (required): Audio file to transcribe

**Response:**
```json
{
  "text": "Complete transcription text here..."
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid file format
- `500`: Transcription failed

---

### POST `/transcribe/diarize`

Transcription with speaker diarization - identifies different speakers and labels them.

**Request:**
```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -F "file=@audio.wav"
```

**Parameters:**
- `file` (required): Audio file to transcribe

**Response:**
```json
{
  "success": true,
  "filename": "audio.wav",
  "full_text": "Complete transcription...",
  "formatted_transcript": "Person 1: Hello there.\n\nPerson 2: Hi, how are you?",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello there.",
      "speaker": "Person 1"
    },
    {
      "start": 3.0,
      "end": 5.2,
      "text": "Hi, how are you?",
      "speaker": "Person 2"
    }
  ],
  "num_speakers": 2,
  "speakers": ["Person 1", "Person 2"]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid file format
- `500`: Transcription failed
- `503`: Speaker diarization not available (missing HuggingFace token)

**Notes:**
- Requires `HUGGINGFACE_TOKEN` environment variable
- Requires acceptance of pyannote model terms
- Audio is automatically converted to WAV format if needed
- Works best with 2-5 speakers

---

## Clinical Note Generation

### POST `/generate-clinical-note`

Generate a structured SOAP format clinical note from a transcript.

**Request:**
```bash
curl -X POST "http://localhost:8000/generate-clinical-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Plain transcript text...",
    "formatted_transcript": "Person 1: Hello...\n\nPerson 2: Hi..."
  }'
```

**Parameters:**
- `transcript` (required): Plain text transcript
- `formatted_transcript` (optional): Transcript with speaker labels

**Request Body Example:**
```json
{
  "transcript": "Doctor: What brings you in today? Patient: I have knee pain for 3 weeks...",
  "formatted_transcript": "Person 1 (Doctor): What brings you in today?\n\nPerson 2 (Patient): I have knee pain for 3 weeks..."
}
```

**Response:**
```json
{
  "success": true,
  "clinical_note": "Subjective:\n- Patient presents with knee pain for 3 weeks duration...\n\nObjective:\n...\n\nAssessment & Plan:\n...",
  "model": "openai-gpt-oss-20b"
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing transcript
- `500`: Generation failed
- `500`: Missing DO_AI_API_KEY

**Notes:**
- Requires `DO_AI_API_KEY` environment variable
- Prefers `formatted_transcript` if available
- Falls back to `transcript` if no formatted version
- Generation takes 10-15 seconds
- Follows SOAP format (Subjective, Objective, Assessment & Plan)
- Only includes explicitly mentioned information

---

## Error Responses

All endpoints may return error responses:

### 400 Bad Request

```json
{
  "detail": "Unsupported file format. Allowed formats: .mp3, .mp4, .wav, .webm, .ogg"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Transcription failed: [error details]"
}
```

### 503 Service Unavailable

```json
{
  "detail": "Speaker diarization is not available. Please set HUGGINGFACE_TOKEN environment variable."
}
```

---

## Rate Limits

Current implementation has no rate limits.

Recommended for production:
- 100 requests/minute per IP
- 1000 requests/hour per IP

---

## File Size Limits

- Recommended max: 100MB
- Server timeout: 300 seconds
- Recommended max duration: 30 minutes of audio

---

## Audio Format Requirements

### Supported Formats
- WAV (preferred for diarization)
- MP3
- MP4/M4A
- WebM
- OGG

### Automatic Conversion
- Non-WAV files are automatically converted for diarization
- Conversion to 16kHz mono WAV
- Happens transparently on the backend

### Recommendations
- Sample rate: 16kHz or higher
- Channels: Mono (stereo is converted)
- Bitrate: 128kbps or higher for MP3

---

## Response Times

Approximate processing times:

| Endpoint | Time per minute of audio |
|----------|--------------------------|
| `/transcribe/simple` | 5-10 seconds |
| `/transcribe` | 5-10 seconds |
| `/transcribe/diarize` | 10-20 seconds |
| `/generate-clinical-note` | 10-15 seconds (fixed) |

Times may vary based on:
- Audio duration
- Number of speakers
- Server resources
- Model loading state

---

## Examples

### Full Workflow Example

```python
import requests

# Step 1: Upload and transcribe with diarization
with open('consultation.wav', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://localhost:8000/transcribe/diarize',
        files=files
    )
    transcription_data = response.json()

# Step 2: Generate clinical note
note_response = requests.post(
    'http://localhost:8000/generate-clinical-note',
    json={
        'transcript': transcription_data['full_text'],
        'formatted_transcript': transcription_data['formatted_transcript']
    }
)
clinical_note = note_response.json()['clinical_note']

print("Transcription:", transcription_data['formatted_transcript'])
print("\nClinical Note:", clinical_note)
```

---

## WebSocket Support

Not currently available. Use HTTP polling for updates.

---

## API Changelog

### v1.0.0 (Current)
- Initial release
- Health check endpoint
- Three transcription endpoints
- Clinical note generation
- Speaker diarization support

---

## Related Documentation

- [API Overview](./overview.md)
- [Request/Response Examples](./request-response.md)
- [Integration Guide](../integration.md)

