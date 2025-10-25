# MedBot Frontend

A beautiful Next.js 15 application for medical voice transcription powered by OpenAI Whisper.

## Features

- 🎤 **Voice Recording**: Record audio directly from your browser
- 📝 **Real-time Transcription**: Convert speech to text using Whisper AI
- 📁 **File Upload**: Upload pre-recorded audio files
- 📊 **Audio Visualization**: Live audio level indicator during recording
- ⏱️ **Recording Timer**: Track your recording duration
- 🎨 **Beautiful UI**: Modern, clean interface inspired by medical documentation tools

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MedBot API running on `http://localhost:8000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Recording Audio

1. Click the **"Start transcribing"** button in the top-right corner
2. Allow microphone access when prompted
3. Speak clearly into your microphone
4. Watch the audio level indicator to ensure your voice is being captured
5. Click **"Stop recording"** when finished
6. Wait for the transcription to appear

### Uploading Audio Files

1. Click the dropdown arrow next to the "Start transcribing" button
2. Select **"Upload session audio"**
3. Choose an audio file (supports: mp3, wav, m4a, webm, ogg)
4. Wait for the transcription to appear

### Supported Audio Formats

- MP3
- WAV
- M4A
- WebM
- OGG
- MPEG
- MPGA

## API Integration

The frontend connects to the MedBot API at `http://localhost:8000`. Make sure the API is running before using the application.

### API Endpoints Used

- `POST /transcribe/simple` - Transcribe audio and return text

## Project Structure

```
medbot-frontend/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── VoiceRecorder.tsx    # Recording component
│   └── TranscriptDisplay.tsx # Display component
├── public/                  # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Web Audio API** - Audio recording and visualization

## Troubleshooting

### Microphone Access Denied

Make sure you allow microphone access in your browser settings.

### API Connection Failed

Ensure the MedBot API is running on `http://localhost:8000`. Start the API with:

```bash
cd ../medbot-api
python index.py
```

### Audio Not Recording

- Check if your microphone is working in other applications
- Try using a different browser (Chrome/Edge recommended)
- Check browser console for error messages

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

