# Frontend Integration - Speaker Diarization

## ✅ What's Been Updated

Your frontend now automatically uses the speaker diarization API! Here's what changed:

## 🎨 Visual Features

### 1. Speaker Labels
- Each speaker is color-coded for easy identification
- **Person 1**: Blue badges
- **Person 2**: Green badges
- **Person 3**: Purple badges
- **Person 4**: Orange badges
- **Person 5**: Pink badges

### 2. Speaker Count Badge
- Shows the total number of speakers detected
- Appears in the transcript header
- Example: "🎭 2 Speakers"

### 3. Speaker Legend
- Shows all speakers at the top of the transcript
- Color-coded badges match the transcript
- Quick reference for who's who

### 4. Formatted Transcript
- Each segment shows the speaker and their text
- Clean, easy-to-read layout
- Proper spacing between different speakers

## 🔄 How It Works

### 1. API Call Flow
```
Recording → /transcribe/diarize → Process → Display with Speakers
                    ↓ (if fails)
              /transcribe/simple (fallback)
```

### 2. Automatic Fallback
If speaker diarization is not available (no HuggingFace token), the app automatically falls back to simple transcription without speaker labels.

### 3. Data Structure
The frontend now receives rich transcription data:

```typescript
{
  text: "Full transcription...",
  formattedTranscript: "Person 1: Hello\n\nPerson 2: Hi there",
  segments: [
    {
      start: 0.0,
      end: 2.5,
      text: "Hello",
      speaker: "Person 1"
    }
  ],
  numSpeakers: 2,
  speakers: ["Person 1", "Person 2"]
}
```

## 📝 Updated Files

### `/components/VoiceRecorder.tsx`
✅ Calls `/transcribe/diarize` endpoint  
✅ Falls back to `/transcribe/simple` if diarization fails  
✅ Passes rich transcription data to parent  

### `/components/TranscriptDisplay.tsx`
✅ Displays speaker labels with color coding  
✅ Shows speaker count badge  
✅ Renders speaker legend  
✅ Handles both diarized and simple transcripts  

### `/app/page.tsx`
✅ Stores full transcription data structure  
✅ Passes speaker info to TranscriptDisplay  

## 🎯 What You See

### Before (Simple Transcription):
```
Hello, how are you? I'm doing well, thanks for asking.
```

### After (With Speaker Diarization):
```
[Person 1] Hello, how are you?

[Person 2] I'm doing well, thanks for asking.
```

With color-coded badges and beautiful formatting!

## 🚀 Testing Your Frontend

### 1. Start Your Frontend
```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-frontend
npm run dev
```

### 2. Make Sure API is Running
```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
python3 index.py
```

### 3. Record or Upload Audio
- Click "Start transcribing" and speak
- Or use "Upload session audio" to upload a file
- If the audio has multiple speakers, you'll see them labeled!

## 📊 Example Scenarios

### Scenario 1: Doctor-Patient Conversation
**Input**: Audio with doctor and patient  
**Output**: 
- Person 1: Doctor's statements
- Person 2: Patient's responses

### Scenario 2: Team Meeting
**Input**: Audio with 3-5 people  
**Output**:
- Person 1, Person 2, Person 3, etc.
- Each color-coded for easy tracking

### Scenario 3: No Diarization Available
**Input**: API without HuggingFace token  
**Output**: Simple transcription (no speaker labels)  
**Status**: Works perfectly, just no speaker info

## 🎨 UI Features

### Header Badge
- Shows speaker count when multiple speakers detected
- Purple badge with user icon
- Appears next to "Transcription" title

### Color-Coded Segments
- Each speaker has a unique color
- Consistent throughout the transcript
- Easy to scan and follow conversations

### Copy Function
- Copy button copies the formatted transcript
- Includes speaker labels
- Ready to paste anywhere

## 🔧 Configuration

All settings are automatic! The frontend will:
1. ✅ Try diarization first (if available)
2. ✅ Fall back to simple transcription (if not)
3. ✅ Display appropriately based on available data
4. ✅ Handle errors gracefully

## 🎬 Demo Flow

1. **Start recording** → Green "Start transcribing" button
2. **Speak** → Audio level indicator shows activity
3. **Stop recording** → Red "Stop recording" button
4. **Processing** → "Transcribing audio..." message
5. **Result** → Beautiful formatted transcript with speakers!

## 💡 Pro Tips

### For Better Speaker Detection:
- Clear audio with minimal background noise
- Distinct voices (different pitches/tones)
- Speakers taking turns (not overlapping)
- At least a few seconds of speech per person

### For Best Results:
- Use good quality microphone
- Record in quiet environment
- Speak clearly and naturally
- Allow brief pauses between speakers

## 🔍 Troubleshooting

### "No speaker labels appearing"
→ Check if API has HuggingFace token set  
→ View API logs for diarization status  

### "Falling back to simple transcription"
→ Normal behavior if diarization unavailable  
→ Still works great, just no speaker labels  

### "All text showing as one person"
→ Audio might have only one speaker  
→ Or speakers sound very similar  

## 📱 Responsive Design

The UI works great on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile (speaker badges stack nicely)

## 🎉 Summary

Your frontend now:
1. ✅ Automatically uses speaker diarization
2. ✅ Falls back gracefully if not available
3. ✅ Shows beautiful color-coded speaker labels
4. ✅ Displays speaker count and legend
5. ✅ Provides excellent user experience

**No configuration needed - it just works!** 🚀

