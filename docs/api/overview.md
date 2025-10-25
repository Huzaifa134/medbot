# API Overview

Complete API reference for MedBot backend.

## 🌐 Base URL

```
http://localhost:8000
```

## 📡 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/transcribe` | POST | Full transcription with details |
| `/transcribe/simple` | POST | Simple text transcription |
| `/transcribe/diarize` | POST | Transcription with speaker labels |
| `/generate-clinical-note` | POST | Generate SOAP format clinical note |

## 🔐 Authentication

Currently, no authentication is required for local development.

For production, implement API key authentication:
```python
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
```

## 📦 Request Format

All file uploads use `multipart/form-data`:

```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@audio.wav"
```

## ✅ Response Format

All successful responses follow this structure:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

## ❌ Error Responses

Error responses include:

```json
{
  "detail": "Error description"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 500 | Internal Server Error |
| 503 | Service Unavailable (missing config) |

## 🎤 Supported Audio Formats

- WAV (.wav)
- MP3 (.mp3)
- MP4/M4A (.mp4, .m4a)
- WebM (.webm)
- OGG (.ogg)

## 📏 Limits

- **Max file size**: 100MB (recommended)
- **Max duration**: 30 minutes (recommended)
- **Concurrent requests**: 5 (default)

## 🔄 Rate Limiting

Currently no rate limiting in development.

For production, recommended limits:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## 📊 Response Times

Typical response times:

| Endpoint | Average Time |
|----------|--------------|
| Health check | < 100ms |
| Simple transcription | 5-10s per minute of audio |
| With diarization | 10-20s per minute of audio |
| Clinical note generation | 10-15s |

## 🔧 CORS Configuration

CORS is enabled for all origins in development:

```python
allow_origins=["*"]
```

For production, restrict to your domain:

```python
allow_origins=["https://yourdomain.com"]
```

## 📝 API Versioning

Current version: `v1` (implicit)

Future versions will use URL prefixes:
```
http://localhost:8000/v2/transcribe
```

## 🚀 Quick Examples

### Python

```python
import requests

# Upload audio file
with open('audio.wav', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://localhost:8000/transcribe/diarize',
        files=files
    )
    result = response.json()
    print(result['formatted_transcript'])
```

### JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('file', fs.createReadStream('audio.wav'));

fetch('http://localhost:8000/transcribe/diarize', {
  method: 'POST',
  body: form
})
.then(res => res.json())
.then(data => console.log(data.formatted_transcript));
```

### cURL

```bash
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -F "file=@audio.wav"
```

## 📚 Detailed Endpoint Documentation

For detailed information about each endpoint:

- [Health Check](./endpoints.md#health-check)
- [Transcription Endpoints](./endpoints.md#transcription)
- [Clinical Note Generation](./endpoints.md#clinical-notes)

## 🔍 WebSocket Support

Currently not implemented. HTTP polling recommended for real-time updates.

Future enhancement: WebSocket endpoint for streaming transcription.

## 📦 SDK Support

Currently no official SDKs. REST API can be used directly.

Community SDKs welcome!

## 🐛 Error Handling

Always check the response status:

```python
response = requests.post(url, files=files)

if response.status_code == 200:
    data = response.json()
    # Process success
elif response.status_code == 400:
    print("Bad request:", response.json()['detail'])
elif response.status_code == 500:
    print("Server error:", response.json()['detail'])
```

## 📝 Request/Response Examples

See [Request/Response Documentation](./request-response.md) for detailed examples of all endpoints.

## 🔗 Related Documentation

- [Endpoint Details](./endpoints.md)
- [Request/Response Examples](./request-response.md)
- [Integration Guide](../integration.md)

