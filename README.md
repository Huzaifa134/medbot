# 🏥 MedBot - AI-Powered Medical Transcription System

<div align="center">

![MedBot Logo](https://img.shields.io/badge/MedBot-Medical%20AI-4CAF50?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Complete AI solution for medical consultation transcription with speaker diarization and clinical note generation**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-endpoints) • [Screenshots](#-demo)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🎤 Voice Recording
- Browser-based audio capture
- Real-time audio level visualization
- Multiple format support (WAV, MP3, WebM, etc.)
- File upload option
- Visual recording feedback

</td>
<td width="50%">

### 📝 Speech-to-Text Transcription
- Powered by OpenAI Whisper
- Accurate medical terminology recognition
- Word-level timestamps
- Multi-language support (90+ languages)
- 95%+ accuracy with clear audio

</td>
</tr>
<tr>
<td>

### 👥 Speaker Diarization
- Automatic speaker identification
- Color-coded speaker labels
- Supports 2-5+ speakers
- Speaker count indicator
- Powered by pyannote.audio 3.1

</td>
<td>

### 🏥 AI Clinical Notes
- SOAP format generation
- Evidence-based documentation
- Powered by DigitalOcean AI
- One-click generation
- Copy & export ready

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- ffmpeg
- HuggingFace account (free)
- DigitalOcean AI API key

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd medbot

# 2. Install ffmpeg
brew install ffmpeg  # macOS
# sudo apt install ffmpeg  # Linux

# 3. Setup Backend
cd medbot-api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 4. Configure Environment
cp .env.example .env
# Edit .env and add your API keys:
# HUGGINGFACE_TOKEN=your_token_here
# DO_AI_API_KEY=your_key_here

# 5. Setup Frontend
cd ../medbot-frontend
npm install
```

### Running

```bash
# Terminal 1 - Backend
cd medbot-api
python3 index.py

# Terminal 2 - Frontend
cd medbot-frontend
npm run dev
```

Open **http://localhost:3000** in your browser!

📚 **Need help?** Check our [Installation Guide](./docs/installation.md) for detailed instructions.

---

## 💻 Tech Stack

<div align="center">

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_Whisper-412991?style=flat&logo=openai&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)

</div>

---

## 📸 Demo

### 🎤 Recording Interface
```
┌────────────────────────────────────────────────┐
│  🏥 MedBot - Medical Voice Assistant           │
├────────────────────────────────────────────────┤
│                                                 │
│  ⏺️  Recording...           00:15              │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░ Audio Level                  │
│                                                 │
│  [Stop Recording]  [Cancel]                     │
│                                                 │
└────────────────────────────────────────────────┘
```

### 📝 Speaker-Labeled Transcript
```
👤 Person 1: Hello, what brings you in today?

👤 Person 2: I've been having pain in my right knee 
for about three weeks now. It gets worse when I 
climb stairs.

👤 Person 1: Can you describe the type of pain? 
Is it sharp or dull?

👤 Person 2: It's more of a sharp pain, especially 
when I bend the knee or put weight on it.
```

### 🏥 Generated Clinical Note (SOAP Format)
```
Subjective:
- Patient presents with right knee pain for 3 weeks duration
- Pain described as sharp in nature  
- Aggravated by climbing stairs, bending knee, and weight-bearing
- Location: Right knee
- No mention of trauma or inciting event

Objective:
[Physical examination findings if discussed]

Assessment & Plan:
- Likely diagnosis: [Assessment based on discussion]
- Recommended investigations: [If mentioned]
- Treatment plan: [If discussed]
```

---

## 📚 Documentation

<table>
<tr>
<td align="center" width="33%">

### 🚀 Getting Started
- [**Installation Guide**](./docs/installation.md)
- [**Quick Start**](./docs/quickstart.md)
- [**Configuration**](./docs/configuration.md)

</td>
<td align="center" width="33%">

### 🔌 API Reference
- [**API Overview**](./docs/api/overview.md)
- [**Endpoints**](./docs/api/endpoints.md)
- [**Examples**](./docs/api/request-response.md)

</td>
<td align="center" width="33%">

### 🛠️ Support
- [**Troubleshooting**](./docs/troubleshooting.md)
- [**FAQ**](./docs/faq.md)
- [**Contributing**](./docs/development/contributing.md)

</td>
</tr>
</table>

---

## 🔌 API Endpoints

### Core Endpoints

| Endpoint | Method | Description | Response Time |
|----------|--------|-------------|---------------|
| `/` | GET | Health check | < 100ms |
| `/transcribe` | POST | Full transcription with metadata | ~5-10s/min audio |
| `/transcribe/simple` | POST | Simple text transcription | ~5-10s/min audio |
| `/transcribe/diarize` | POST | Transcription with speaker labels | ~10-20s/min audio |
| `/generate-clinical-note` | POST | Generate SOAP format note | ~10-15s |

### Example Usage

```bash
# Transcribe with speaker diarization
curl -X POST "http://localhost:8000/transcribe/diarize" \
  -F "file=@consultation.wav"

# Generate clinical note
curl -X POST "http://localhost:8000/generate-clinical-note" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Doctor: What brings you in...",
    "formatted_transcript": "Person 1: What brings you in..."
  }'
```

**Full API documentation:** [docs/api/overview.md](./docs/api/overview.md)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Browser Frontend (Next.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Voice       │  │  Transcript  │  │  Clinical    │      │
│  │  Recorder    │→ │  Display     │→ │  Note        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
┌────────────────────────────▼────────────────────────────────┐
│                    FastAPI Backend (Python)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Whisper    │  │  pyannote    │  │ DigitalOcean │      │
│  │   Speech-    │→ │  Speaker     │→ │  AI Model    │      │
│  │   to-Text    │  │  Diarization │  │  Clinical    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  • Audio Format Conversion (pydub)                          │
│  • Temporary File Management                                 │
│  • Error Handling & Logging                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Use Cases

- **📋 Medical Consultations**: Record and transcribe doctor-patient conversations
- **🏥 Clinical Documentation**: Generate structured SOAP notes automatically
- **📊 Medical Research**: Transcribe interviews and focus groups
- **👨‍⚕️ Telemedicine**: Document virtual consultations efficiently
- **📝 Medical Education**: Transcribe lectures and case discussions
- **🔬 Grand Rounds**: Document complex multi-speaker discussions

---

## 🎬 How to Use

### 1️⃣ Start Recording
- Click the **"Start transcribing"** button
- Grant microphone permissions if prompted
- Speak clearly into your microphone

### 2️⃣ Record Consultation
```
Doctor: "Hello, what brings you in today?"
[Brief pause for speaker change]
Patient: "I've been experiencing lower back pain for two weeks..."
```

### 3️⃣ Stop & Process
- Click **"Stop recording"** when done
- Wait 5-15 seconds for processing
- View transcript with speaker labels

### 4️⃣ Generate Clinical Note
- Click **"Generate Note"** button
- Wait 10-15 seconds
- Review SOAP format note
- Copy or export as needed

---

## 🔒 Security & Privacy

⚠️ **Important:** Current version is for **development/testing only**.

**Current State:**
- ✅ Local audio processing
- ✅ Temporary file deletion
- ✅ No persistent storage
- ❌ Not HIPAA compliant
- ❌ Not for production medical use

**For Production Use, Add:**
- End-to-end encryption
- Secure data storage
- User authentication
- Audit logging
- HIPAA compliance measures
- Business Associate Agreements

---

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| ![Chrome](https://img.shields.io/badge/Chrome-✅-green) | **Recommended** | Best performance |
| ![Edge](https://img.shields.io/badge/Edge-✅-green) | **Recommended** | Full support |
| ![Firefox](https://img.shields.io/badge/Firefox-✅-green) | Full support | Works well |
| ![Safari](https://img.shields.io/badge/Safari-⚠️-yellow) | Limited | Audio format issues |
| ![Mobile](https://img.shields.io/badge/Mobile-⚠️-yellow) | Experimental | Limited testing |

---

## 📊 Performance Metrics

- **Transcription Speed**: 5-10 seconds per minute of audio
- **Diarization Speed**: 10-20 seconds per minute of audio  
- **Clinical Note Generation**: 10-15 seconds (fixed)
- **Max Recommended Length**: 30 minutes
- **Accuracy**: 80-95% (depends on audio quality)
- **Supported Speakers**: 2-5+ (works best with 2-3)

---

## 🛣️ Roadmap

### Coming Soon
- [ ] Real-time transcription (WebSocket)
- [ ] Export to PDF/DOCX
- [ ] Custom medical vocabulary
- [ ] Multi-language clinical notes
- [ ] Mobile apps (iOS/Android)

### Future Enhancements
- [ ] Integration with EHR systems
- [ ] User authentication & roles
- [ ] Audio file management
- [ ] Consultation history
- [ ] Team collaboration features
- [ ] Docker deployment
- [ ] Cloud deployment guides

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

```bash
# 1. Fork the repository
git clone https://github.com/yourusername/medbot.git

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes
# ... code code code ...

# 4. Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

**Areas for Contribution:**
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation
- 🎨 UI/UX improvements
- 🧪 Testing
- 🌍 Translations

See [Contributing Guide](./docs/development/contributing.md) for details.

---

## 🐛 Troubleshooting

### Quick Fixes

**Backend won't start?**
```bash
lsof -ti:8000 | xargs kill -9  # Kill existing process
cd medbot-api && python3 index.py  # Restart
```

**Speaker diarization not working?**
```bash
# 1. Accept model terms at HuggingFace
# 2. Check .env file (no quotes around token!)
# 3. Restart backend server
```

**Clinical notes failing?**
```bash
# Check DO_AI_API_KEY in .env
cat medbot-api/.env | grep DO_AI_API_KEY
```

**For more help:** [Troubleshooting Guide](./docs/troubleshooting.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Free for personal and commercial use
```

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- **[OpenAI Whisper](https://github.com/openai/whisper)** - State-of-the-art speech recognition
- **[pyannote.audio](https://github.com/pyannote/pyannote-audio)** - Speaker diarization toolkit
- **[DigitalOcean AI](https://www.digitalocean.com/products/ai-ml)** - AI inference platform
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[Next.js](https://nextjs.org/)** - React framework for production

---

## 📞 Support & Community

<table>
<tr>
<td align="center" width="33%">

### 📖 Documentation
[Read the Docs](./docs/)

Comprehensive guides and tutorials

</td>
<td align="center" width="33%">

### 💬 Discussions
[GitHub Discussions](#)

Ask questions and share ideas

</td>
<td align="center" width="33%">

### 🐛 Issues
[Report Bug](#)

Found a bug? Let us know!

</td>
</tr>
</table>

---

## ⭐ Star History

If you find MedBot useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/medbot&type=Date)](https://star-history.com/#yourusername/medbot&Date)

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/medbot?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/medbot?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/medbot)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/medbot)

---

## 🎊 What's Included

✅ Complete backend API with 5 endpoints  
✅ Modern React frontend with TypeScript  
✅ Speaker diarization for multiple speakers  
✅ AI-powered clinical note generation  
✅ SOAP format templates  
✅ Comprehensive documentation (25+ pages)  
✅ Error handling and validation  
✅ Beautiful UI with loading states  
✅ Audio format conversion  
✅ Real-time audio visualization  

---

<div align="center">

## 🚀 Ready to Get Started?

**[📥 Install Now](./docs/installation.md)** • **[📖 Read Docs](./docs/)** • **[🔌 API Reference](./docs/api/overview.md)**

---

**Made with ❤️ for healthcare professionals**

[Website](#) • [Documentation](./docs/) • [API Docs](./docs/api/overview.md) • [Contributing](./docs/development/contributing.md)

</div>
