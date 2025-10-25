# Quick Start Guide

Get up and running with MedBot in 5 minutes!

## ⚡ Prerequisites

Make sure you've completed the [Installation Guide](./installation.md) first.

## 🚀 Starting the System

### Step 1: Start the Backend

```bash
cd medbot-api
python3 index.py
```

Wait for:
```
Loading Whisper model...
Whisper model loaded successfully!
Loading speaker diarization model...
Speaker diarization model loaded successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Start the Frontend

Open a new terminal:

```bash
cd medbot-frontend
npm run dev
```

Wait for:
```
✓ Ready in 2.3s
➜ Local:   http://localhost:3000
```

### Step 3: Open the Application

Open your browser and go to: **http://localhost:3000**

## 🎤 Recording Your First Consultation

### 1. Start Recording

- Click the green **"Start transcribing"** button
- Grant microphone permissions if prompted
- You'll see the audio level indicator responding to sound

### 2. Speak Your Consultation

Example dialogue:
```
"Hello, what brings you in today?"
[Pause]
"I've been having pain in my right knee for about three weeks."
[Pause]
"Can you describe the pain?"
[Pause]
"It's a sharp pain, especially when I climb stairs."
```

### 3. Stop Recording

- Click the red **"Stop recording"** button
- Wait 5-10 seconds for processing

### 4. View Results

The system will automatically:
- Transcribe the audio
- Identify different speakers
- Display color-coded transcript

## 📝 Generating a Clinical Note

### From Transcript Tab

1. After transcription completes, click the purple **"Generate Note"** button
2. Wait 10-15 seconds for AI processing
3. Automatically switches to the "Note" tab

### From Note Tab

1. Click on the **"Note"** tab
2. Click **"Generate Clinical Note"** button
3. Wait for AI to generate the structured SOAP note

## 🎯 Understanding the Interface

### Header Section
- **Patient Details**: Shows date, time, language
- **Voice Recorder**: Main recording controls
- **Audio Indicator**: Visual feedback of audio levels
- **Timer**: Shows recording duration

### Tabs
- **Transcript**: View transcription with speaker labels
- **Context**: (Coming soon)
- **Note**: View AI-generated clinical notes

### Transcript Tab Features
- **Color-coded speakers**: Each speaker has a unique color
- **Speaker legend**: Shows all identified speakers
- **Speaker count badge**: Indicates number of speakers
- **Generate Note button**: Creates clinical documentation
- **Copy button**: Copy transcript to clipboard

### Note Tab Features
- **Structured SOAP format**: Professional medical documentation
- **Copy button**: Copy note to clipboard
- **Regenerate button**: Create a new version
- **Download button**: (Coming soon)

## 💡 Tips for Best Results

### Audio Quality
- ✅ Use in a quiet environment
- ✅ Speak clearly and at normal volume
- ✅ Allow brief pauses between speakers
- ❌ Avoid background music or noise
- ❌ Don't overlap speech

### Recording Tips
- Start with speaker identification ("Doctor:", "Patient:")
- Pause briefly between statements
- Speak medical terms clearly
- Include complete information for better notes

### Clinical Note Tips
- More detailed consultations = Better notes
- Include vitals, examination findings, plans
- Review and edit AI-generated notes before use
- AI only includes mentioned information

## 🔍 Testing the System

### Test Audio

Record this sample consultation:

```
Speaker 1: "Hello, welcome. What brings you in today?"

Speaker 2: "I've been experiencing lower back pain for about two weeks now. It started after I was lifting heavy boxes at work."

Speaker 1: "I see. On a scale of one to ten, how would you rate the pain?"

Speaker 2: "I'd say it's about a seven, especially in the morning."

Speaker 1: "Have you taken any medications for it?"

Speaker 2: "Yes, I've been taking ibuprofen 400 milligrams twice a day."

Speaker 1: "Okay. Let me examine your back. Please stand up and try to touch your toes."

Speaker 2: "Ouch, I can only get halfway down."

Speaker 1: "I understand. Based on the examination, it appears to be acute lumbar strain. I recommend continuing the ibuprofen, adding some physical therapy, and avoiding heavy lifting for the next two weeks. Let's schedule a follow-up in two weeks to reassess."
```

Expected Results:
- 2 speakers identified (Person 1, Person 2)
- Complete transcript with color coding
- Clinical note with Subjective, Objective, and Assessment sections

## 📱 Browser Compatibility

MedBot works best with:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Safari (macOS)
- ✅ Firefox
- ⚠️ Mobile browsers (limited support)

## 🎬 Common Workflows

### Workflow 1: Simple Transcription
```
Record → Transcribe → Copy → Done
```

### Workflow 2: Multi-Speaker Documentation
```
Record → Transcribe → View Speakers → Generate Note → Copy → Done
```

### Workflow 3: Detailed Clinical Documentation
```
Record → Transcribe → Review Speakers → Generate Note → Edit/Review → Copy → Done
```

## ⚙️ Quick Commands

```bash
# Stop Backend
lsof -ti:8000 | xargs kill -9

# Restart Backend
cd medbot-api && python3 index.py

# View Backend Logs
tail -f medbot-api/server.log

# Stop Frontend
# Press Ctrl+C in the terminal running npm

# Restart Frontend
cd medbot-frontend && npm run dev
```

## 🐛 Quick Troubleshooting

### "No audio detected"
- Check microphone permissions
- Ensure microphone is connected
- Try refreshing the page

### "Transcription failed"
- Verify backend is running
- Check http://localhost:8000/
- Review backend logs

### "Speaker diarization not available"
- Check HUGGINGFACE_TOKEN in .env
- Verify model terms accepted
- Restart backend server

### "Clinical note generation failed"
- Check DO_AI_API_KEY in .env
- Verify internet connection
- Check API key is valid

## 📚 Next Steps

Now that you're up and running:

1. **Explore Features**: Try all tabs and buttons
2. **Read Documentation**: Check feature-specific guides
3. **Customize Settings**: Review [Configuration Guide](./configuration.md)
4. **API Integration**: Read [API Documentation](./api/overview.md)

## 🆘 Need More Help?

- [Full Documentation](./README.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [FAQ](./faq.md)
- [API Reference](./api/overview.md)

---

**Congratulations! You're now ready to use MedBot!** 🎉

