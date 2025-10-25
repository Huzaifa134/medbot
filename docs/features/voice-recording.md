# Voice Recording Feature

Complete guide to the voice recording functionality in MedBot.

## 🎤 Overview

MedBot's voice recording feature provides browser-based audio capture with real-time feedback and multiple input options.

## ✨ Features

### Recording Capabilities
- ✅ Browser-based recording (no app needed)
- ✅ Real-time audio level visualization
- ✅ Recording duration timer
- ✅ File upload alternative
- ✅ Multiple audio format support
- ✅ Automatic format detection

### Visual Feedback
- 🎚️ Audio level meter
- ⏱️ Recording timer
- 🎨 Color-coded states (recording, idle, processing)
- 📊 Visual waveform indicator

## 🚀 How to Use

### Starting a Recording

1. **Click "Start transcribing" button**
   - Button turns red when recording
   - Timer starts counting

2. **Grant Microphone Permission**
   - Browser will ask for permission
   - Click "Allow"
   - Permission is remembered for future use

3. **Speak into Microphone**
   - Watch audio level indicator respond
   - Ensure consistent levels (middle range)
   - Avoid clipping (max level)

4. **Stop Recording**
   - Click "Stop recording" button
   - Recording is automatically uploaded
   - Processing begins immediately

### Uploading a File

1. **Click file upload button** (📁 icon)
2. **Select audio file** from your computer
3. **Supported formats:**
   - WAV (.wav)
   - MP3 (.mp3)
   - MP4 (.mp4, .m4a)
   - WebM (.webm)
   - OGG (.ogg)

## 🎛️ Audio Level Indicator

### What It Shows

```
▓▓▓▓▓▓▓▓▓▓░░░░░  Good - Optimal level
▓▓▓░░░░░░░░░░░░  Too Quiet - Speak louder
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Too Loud - Reduce volume
```

### Optimal Levels
- **Good**: 40-70% of meter (green)
- **Acceptable**: 30-80% (yellow)
- **Too Quiet**: < 30% (may affect quality)
- **Too Loud**: > 80% (may cause distortion)

## 🔧 Technical Details

### Browser Support

| Browser | Recording | File Upload | Notes |
|---------|-----------|-------------|-------|
| Chrome | ✅ Full | ✅ | Recommended |
| Edge | ✅ Full | ✅ | Recommended |
| Firefox | ✅ Full | ✅ | Good support |
| Safari | ⚠️ Limited | ✅ | Some format issues |
| Mobile Chrome | ⚠️ Experimental | ✅ | Works but limited |
| Mobile Safari | ⚠️ Experimental | ✅ | Works but limited |

### Recording Format

**Default Output:**
- Container: WebM (Chrome/Edge) or MP4 (Safari)
- Codec: Opus (WebM) or AAC (MP4)
- Sample Rate: 48kHz (browser default)
- Channels: Mono or Stereo

**Backend Processing:**
- Automatically converted to 16kHz mono WAV for diarization
- Original format preserved for Whisper transcription
- Temporary files cleaned up after processing

### MediaRecorder API

MedBot uses the browser's MediaRecorder API:

```typescript
// How it works internally:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    // ... recording happens ...
    mediaRecorder.stop();
  });
```

## 💡 Best Practices

### For Best Quality

#### Environment
- 🔇 Quiet room (no background noise)
- 🚪 Close windows/doors
- 🔊 Turn off fans, AC, music
- 📱 Silence phones and notifications

#### Microphone
- 🎤 Use external microphone if possible
- 📏 Position 6-12 inches from mouth
- 🎯 Point directly at speaker
- 🔌 Check connection is secure

#### Speaking
- 🗣️ Speak clearly and naturally
- ⏸️ Pause between speakers
- 🔊 Consistent volume
- 🐢 Not too fast
- 🔤 Enunciate medical terms

#### Recording
- ⏱️ 5-30 minutes ideal
- 💾 Keep under 100MB
- 🔄 Break long sessions into segments
- ✅ Test setup first with short recording

### Common Mistakes to Avoid

- ❌ Too close to microphone (causes distortion)
- ❌ Too far from microphone (too quiet)
- ❌ Background music or TV
- ❌ Overlapping speakers
- ❌ Eating/drinking while recording
- ❌ Moving microphone during recording
- ❌ Using laptop's built-in mic in noisy room

## 🎯 Recording Tips by Use Case

### Doctor-Patient Consultation
```
✅ Position microphone between speakers
✅ Identify speakers at start ("This is Dr. Smith...")
✅ Pause briefly when speaker changes
✅ Speak medical terms slowly and clearly
```

### Multi-Speaker Rounds
```
✅ Use omnidirectional microphone
✅ Central placement
✅ Have speakers identify themselves
✅ Minimize cross-talk
```

### Single Speaker Documentation
```
✅ Close microphone placement (6 inches)
✅ Speak directly into mic
✅ Consistent pace
✅ No special considerations needed
```

## 🐛 Troubleshooting

### No Audio Detected

**Possible Causes:**
1. Microphone not connected
2. Wrong input device selected
3. Microphone muted
4. Browser permissions denied

**Solutions:**
```bash
# Check system settings
macOS: System Settings → Sound → Input
Windows: Settings → System → Sound → Input

# Check browser permissions
Chrome: Settings → Privacy → Microphone
```

### Low Quality Recording

**Causes & Solutions:**
- **Background noise** → Find quieter location
- **Poor microphone** → Use better microphone
- **Wrong input selected** → Select correct device
- **Low input volume** → Increase microphone gain

### Recording Cuts Off

**Causes:**
- Browser tab became inactive
- System went to sleep
- Memory/storage full

**Solutions:**
- Keep tab active during recording
- Prevent system sleep
- Free up disk space

### "Microphone Permission Denied"

**Solution:**
1. Click padlock icon in address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh page
5. Try recording again

## 📊 Recording Quality vs File Size

| Quality | Sample Rate | File Size (per min) | Use Case |
|---------|-------------|---------------------|----------|
| Low | 16kHz | ~1 MB | Quick testing |
| Medium | 32kHz | ~2 MB | Normal use |
| High | 48kHz | ~3 MB | Best quality |

**Recommendation:** Browser default (usually 48kHz) is fine - backend optimizes automatically.

## 🔒 Privacy & Security

### Where is Audio Stored?

**During Recording:**
- In browser memory only
- Not sent anywhere

**During Upload:**
- Sent to local backend (localhost)
- Processed in temporary file
- Deleted immediately after processing

**After Processing:**
- Audio file deleted
- Transcript kept in browser memory
- Not stored on server
- Lost when page refreshes

### Network Requirements

**Recording:** 
- ✅ Works completely offline
- No internet needed

**Transcription:**
- ✅ Mostly offline (local processing)
- ⚠️ Clinical notes require internet (DigitalOcean AI)

## 📈 Performance

### Typical Recording Session

```
Action                    Time
─────────────────────────────────
Start recording          < 1s
Record 5 minutes         5m 0s
Stop recording           < 1s
Upload to backend        1-3s
Transcription            30-60s
Display results          < 1s
─────────────────────────────────
Total                    6m 30s - 7m 0s
```

### Resource Usage

- **CPU**: Minimal during recording
- **Memory**: ~10-20MB per minute of audio
- **Network**: Only during upload/processing
- **Disk**: Temporary files only

## 🔍 Advanced Features

### Custom MediaRecorder Settings

For developers who want to customize:

```typescript
// In VoiceRecorder.tsx
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 128000,  // Customize bitrate
  bitsPerSecond: 128000
});
```

### Audio Constraints

```typescript
const constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000
  }
};
```

## 📚 Related Documentation

- [Speech-to-Text Feature](./transcription.md)
- [Speaker Diarization](./speaker-diarization.md)
- [Troubleshooting Guide](../troubleshooting.md)
- [Browser Compatibility](../browser-compatibility.md)

---

**Ready to record?** Start by clicking the "Start transcribing" button on the main page!

