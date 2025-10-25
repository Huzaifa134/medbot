# Frequently Asked Questions (FAQ)

Common questions and answers about MedBot.

## General Questions

### What is MedBot?

MedBot is an AI-powered medical transcription system that converts spoken consultations into text, identifies different speakers, and generates structured clinical notes.

### Is MedBot HIPAA compliant?

**No.** The current version is designed for development and testing purposes only. For HIPAA compliance, you would need:
- End-to-end encryption
- Secure data storage
- Audit logging
- Business Associate Agreements
- Regular security audits

### Can I use MedBot for real medical consultations?

The current version is **not suitable for production medical use**. It should be used for:
- Development and testing
- Educational purposes
- Research (with proper consent)
- Personal experimentation

### How accurate is the transcription?

Whisper's accuracy depends on:
- Audio quality (80-95% with clear audio)
- Speaker clarity
- Background noise
- Medical terminology (may need custom vocabulary)

Always review and edit transcriptions before use.

### What languages are supported?

Whisper supports 90+ languages, including:
- English
- Spanish
- French
- German
- Chinese
- And many more

However, clinical note generation currently works best with English.

---

## Setup & Installation

### Do I need a powerful computer?

**Minimum Requirements:**
- 8GB RAM (16GB recommended)
- Modern CPU (Intel i5/AMD Ryzen 5 or better)
- 5GB storage for models
- Internet connection (initial setup)

**No GPU required** - CPU-only mode works fine.

### How long does installation take?

- Basic setup: 10-15 minutes
- Model downloads: 5-10 minutes (first time only)
- Total first-time setup: ~25 minutes

### Do I need to pay for anything?

**Free Components:**
- Whisper (open source)
- pyannote.audio (free with HuggingFace account)
- FastAPI (open source)
- Next.js (open source)

**Paid Components:**
- DigitalOcean AI API (for clinical notes)
- Optional: Cloud hosting

### Can I run this offline?

**Partially:**
- ✅ Voice recording works offline
- ✅ Transcription works offline (after models downloaded)
- ✅ Speaker diarization works offline (after models downloaded)
- ❌ Clinical note generation requires internet (calls DigitalOcean AI)

---

## Technical Questions

### Why do I need a HuggingFace account?

HuggingFace hosts the pyannote speaker diarization models. You need:
1. A free account
2. An access token
3. To accept the model terms

This is a one-time setup.

### What audio formats are supported?

**Supported:**
- WAV (preferred)
- MP3
- MP4/M4A
- WebM
- OGG

**Automatically converted:**
- Non-WAV formats are converted to WAV for diarization
- No action needed from you

### How does speaker diarization work?

pyannote.audio:
1. Analyzes voice characteristics
2. Identifies unique speakers
3. Assigns labels (Person 1, Person 2, etc.)
4. Maps speech segments to speakers

Works best with:
- Clear audio
- Distinct voices
- 2-5 speakers

### Can I customize the AI prompts?

**Yes!** The system prompt for clinical notes is in `medbot-api/index.py`:

```python
system_prompt = """You are a medical documentation assistant..."""
```

You can modify it to match your specialty or preferences.

### Why is the first transcription slow?

First transcription includes:
- Model loading into memory (~30 seconds)
- Initial processing setup

Subsequent transcriptions are much faster (5-10s per minute of audio).

---

## Usage Questions

### How long can my recordings be?

**Recommended:** Up to 30 minutes

**Technical limit:** Depends on your system resources

Longer recordings:
- Take more time to process
- Use more memory
- May timeout

For long consultations, consider breaking into segments.

### Can I upload pre-recorded files?

**Yes!** The frontend includes a file upload option:
1. Click the file upload button
2. Select your audio file
3. Wait for processing

Supports the same formats as recording.

### Why aren't speakers being labeled?

**Possible reasons:**

1. **Only one speaker** - System won't label single speaker
2. **Very similar voices** - Can't differentiate
3. **Poor audio quality** - Can't identify speakers
4. **Diarization disabled** - Check HUGGINGFACE_TOKEN
5. **Fallback mode** - System fell back to simple transcription

### How do I save my transcriptions?

**Current options:**
- Copy to clipboard (button in UI)
- Copy clinical note (button in Note tab)
- Manually save to a file

**Coming soon:**
- Export to PDF
- Export to DOCX
- Direct EHR integration

### Can multiple people use MedBot at once?

**Current version:** Single user at a time

**Considerations for multi-user:**
- FastAPI supports concurrent requests
- Each transcription is independent
- Resource sharing may slow processing
- Would need user authentication

---

## Troubleshooting

### Why is my microphone not working?

**Check:**
1. Browser permissions (click padlock icon)
2. System microphone settings
3. Correct microphone selected
4. Microphone not used by another app
5. Try different browser

### The transcription is inaccurate. Why?

**Improve accuracy:**
- Speak clearly and slowly
- Reduce background noise
- Use a better microphone
- Ensure proper volume levels
- Speak medical terms carefully

### Clinical notes don't include everything. Why?

**By design!** The AI only includes information explicitly mentioned in the transcript. This prevents:
- Making up information
- Assuming details
- Adding boilerplate content

If something's missing, it wasn't clearly stated in the recording.

### Can I regenerate a clinical note?

**Yes!** Click "Regenerate Note" in the Note tab. Each generation may vary slightly due to AI's creative nature.

---

## Privacy & Security

### Where is my data stored?

**Current version:**
- Audio files: Temporary files deleted after processing
- Transcriptions: In browser memory only (not saved)
- Clinical notes: In browser memory only (not saved)

**No persistent storage** in current version.

### Who can access my recordings?

**Local setup:**
- Only you (runs on your computer)

**API calls:**
- HuggingFace: Model inference (no data stored)
- DigitalOcean: Clinical note generation (check their privacy policy)

### Is the audio transmitted over the internet?

**Local processing:**
- Recording: Browser only
- Transcription: Local (backend on your machine)
- Diarization: Local (backend on your machine)

**Internet required:**
- Clinical note generation (DigitalOcean AI)
- Initial model downloads
- HuggingFace model access

---

## Advanced Questions

### Can I use a different Whisper model?

**Yes!** Models available:
- `tiny` - Fastest, least accurate
- `base` - **Default** - Good balance
- `small` - Better accuracy
- `medium` - Higher accuracy
- `large` - Best accuracy, slowest

Change in `medbot-api/index.py`:
```python
model = whisper.load_model("medium")
```

### Can I use a different AI model for notes?

**Yes!** The code uses DigitalOcean AI, but you can modify to use:
- OpenAI GPT-4
- Anthropic Claude
- Local LLMs (Llama, etc.)

Modify the `generate_clinical_note` function in `index.py`.

### Can I deploy this to the cloud?

**Yes!** Options:
- Docker containers
- AWS/GCP/Azure
- DigitalOcean Droplets
- Heroku
- Vercel (frontend)

See [Deployment Guide](./deployment/production.md) (coming soon).

### Can I add authentication?

**Yes!** Suggestions:
- JWT tokens
- OAuth2
- Session-based auth
- API keys

Would require modifying both frontend and backend.

### Can I integrate with an EHR?

**Possible, but requires:**
- EHR API access
- HL7/FHIR knowledge
- Authentication setup
- Compliance requirements
- Custom development

This is a significant undertaking.

---

## Comparison Questions

### MedBot vs Dragon Medical?

**MedBot:**
- ✅ Free and open source
- ✅ Speaker diarization
- ✅ Customizable
- ❌ Not production-ready
- ❌ Limited medical vocabulary

**Dragon Medical:**
- ✅ Medical-specific
- ✅ Production-ready
- ✅ HIPAA compliant
- ❌ Expensive
- ❌ Proprietary

### MedBot vs Otter.ai?

**MedBot:**
- ✅ Medical-focused
- ✅ Clinical note generation
- ✅ Self-hosted
- ❌ Setup required

**Otter.ai:**
- ✅ Easy to use
- ✅ Cloud-based
- ✅ Good UI
- ❌ Not medical-specific
- ❌ Privacy concerns for medical use

---

## Future Features

### What features are planned?

See [Roadmap](../README.md#roadmap):
- Real-time transcription
- Mobile apps
- EHR integration
- Custom vocabulary
- Export options
- And more!

### Can I request a feature?

**Yes!** Please:
1. Check existing issues
2. Open a GitHub issue
3. Describe your use case
4. Provide examples if possible

### Can I contribute?

**Absolutely!** See [Contributing Guide](./development/contributing.md):
- Bug fixes
- New features
- Documentation
- Testing
- Design improvements

---

## Support

### Where can I get help?

1. **Documentation**: Check [docs](./README.md)
2. **Troubleshooting**: See [troubleshooting guide](./troubleshooting.md)
3. **GitHub Issues**: Report bugs or ask questions
4. **This FAQ**: Common questions answered here

### How do I report a bug?

1. Check if it's a known issue
2. Try troubleshooting steps
3. Collect error messages and logs
4. Open a GitHub issue with:
   - Description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - System info

### How do I suggest an improvement?

Open a GitHub issue with:
- Clear description
- Use case explanation
- Benefits
- Possible implementation ideas

---

## Contributing & Development

### What skills do I need to contribute?

**Helpful skills:**
- Python (backend)
- TypeScript/React (frontend)
- FastAPI
- Audio processing
- Machine learning
- UI/UX design
- Technical writing

**But you don't need all of them!** Start with what you know.

### How is the project structured?

```
medbot/
├── medbot-api/          # Backend (Python)
├── medbot-frontend/     # Frontend (Next.js)
└── docs/               # Documentation
```

See [Architecture Guide](./development/architecture.md) for details.

---

## Licensing

### Can I use this commercially?

**Yes!** MIT License allows:
- Commercial use
- Modification
- Distribution
- Private use

**But remember:**
- No warranty
- Not production-ready as-is
- Requires compliance work for medical use

### Can I sell products based on MedBot?

**Yes!** Under MIT License you can:
- Build commercial products
- Sell services
- Create SaaS offerings

**Please:**
- Give attribution
- Ensure compliance
- Add necessary security
- Don't claim official endorsement

---

**Still have questions?** Open a GitHub issue or check our [documentation](./README.md)!

