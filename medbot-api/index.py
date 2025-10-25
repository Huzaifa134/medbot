from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import whisper
import tempfile
import os
from pathlib import Path
import traceback
from pyannote.audio import Pipeline
import torch
from dotenv import load_dotenv
from pydub import AudioSegment
import subprocess
import requests
from typing import Dict, Any

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="MedBot API", description="Medical Audio Transcription API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model (using 'base' model - you can change to 'tiny', 'small', 'medium', or 'large')
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper model loaded successfully!")

# Load Pyannote diarization pipeline
# Note: Requires HuggingFace token with access to pyannote models
print("Loading speaker diarization model...")
try:
    # Try to load with token from environment variable
    hf_token = os.environ.get("HUGGINGFACE_TOKEN")
    if hf_token:
        diarization_pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=hf_token
        )
        print("Speaker diarization model loaded successfully!")
    else:
        print("WARNING: HUGGINGFACE_TOKEN not found. Speaker diarization will not be available.")
        print("To enable it, get a token from https://huggingface.co/settings/tokens")
        print("and accept terms at https://huggingface.co/pyannote/speaker-diarization-3.1")
        diarization_pipeline = None
except Exception as e:
    print(f"WARNING: Could not load diarization model: {str(e)}")
    print("Speaker diarization will not be available.")
    diarization_pipeline = None


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "MedBot API is running",
        "status": "healthy",
        "whisper_model": "base"
    }


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file using Whisper
    
    Supported formats: mp3, mp4, mpeg, mpga, m4a, wav, webm
    """
    
    # Validate file type
    allowed_extensions = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm", ".ogg"}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Allowed formats: {', '.join(allowed_extensions)}"
        )
    
    temp_file_path = None
    try:
        # Read the file content
        content = await file.read()
        
        # Validate file is not empty
        if not content or len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
        
        print(f"File size: {len(content)} bytes")
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Verify temp file exists and has content
        if not os.path.exists(temp_file_path):
            raise Exception("Failed to create temporary file")
        
        file_size = os.path.getsize(temp_file_path)
        print(f"Transcribing file: {file.filename} (saved as {temp_file_path}, size: {file_size} bytes)")
        
        if file_size == 0:
            raise Exception("Temporary file is empty")
        
        # Transcribe using Whisper
        result = model.transcribe(temp_file_path, fp16=False)  # Explicitly disable FP16
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        # Validate result
        if not result or "text" not in result:
            raise Exception("Transcription returned invalid result")
        
        return {
            "success": True,
            "filename": file.filename,
            "transcription": result["text"],
            "language": result.get("language", "unknown"),
            "segments": result.get("segments", [])
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass
        raise
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(f"ERROR TYPE: {type(e).__name__}")
        print(traceback.format_exc())
        
        # Clean up temporary file if it exists
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as cleanup_error:
                print(f"Cleanup error: {str(cleanup_error)}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )


@app.post("/transcribe/simple")
async def transcribe_audio_simple(file: UploadFile = File(...)):
    """
    Transcribe audio file - returns only the text (simplified version)
    """
    
    allowed_extensions = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm", ".ogg"}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Allowed formats: {', '.join(allowed_extensions)}"
        )
    
    temp_file_path = None
    try:
        # Read the file content
        content = await file.read()
        
        # Validate file is not empty
        if not content or len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
        
        print(f"File size: {len(content)} bytes")
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Verify temp file exists and has content
        if not os.path.exists(temp_file_path):
            raise Exception("Failed to create temporary file")

        print(f"Temp file path: {temp_file_path}")
        
        file_size = os.path.getsize(temp_file_path)
        print(f"Transcribing file: {file.filename} (saved as {temp_file_path}, size: {file_size} bytes)")
        
        if file_size == 0:
            raise Exception("Temporary file is empty")
        
        # Transcribe using Whisper
        result = model.transcribe(temp_file_path, fp16=False)  # Explicitly disable FP16
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        # Validate result
        if not result or "text" not in result:
            raise Exception("Transcription returned invalid result")
        
        return {
            "text": result["text"]
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass
        raise
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(f"ERROR TYPE: {type(e).__name__}")
        print(traceback.format_exc())
        
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as cleanup_error:
                print(f"Cleanup error: {str(cleanup_error)}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )


@app.post("/transcribe/diarize")
async def transcribe_with_diarization(file: UploadFile = File(...)):
    """
    Transcribe audio file with speaker diarization
    Returns transcription with speaker labels (Person 1, Person 2, etc.)
    """
    
    if diarization_pipeline is None:
        raise HTTPException(
            status_code=503,
            detail="Speaker diarization is not available. Please set HUGGINGFACE_TOKEN environment variable."
        )
    
    allowed_extensions = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm", ".ogg"}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Allowed formats: {', '.join(allowed_extensions)}"
        )
    
    temp_file_path = None
    try:
        # Read the file content
        content = await file.read()
        
        # Validate file is not empty
        if not content or len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
        
        print(f"File size: {len(content)} bytes")
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Verify temp file exists and has content
        if not os.path.exists(temp_file_path):
            raise Exception("Failed to create temporary file")
        
        file_size = os.path.getsize(temp_file_path)
        print(f"Processing file: {file.filename} (saved as {temp_file_path}, size: {file_size} bytes)")
        
        if file_size == 0:
            raise Exception("Temporary file is empty")
        
        # Convert to WAV format for pyannote compatibility
        wav_file_path = None
        try:
            if not temp_file_path.endswith('.wav'):
                print(f"Converting {file_ext} to WAV format for diarization...")
                # Create WAV file path
                wav_file_path = temp_file_path.rsplit('.', 1)[0] + '_converted.wav'
                
                # Convert using pydub (which uses ffmpeg)
                audio = AudioSegment.from_file(temp_file_path)
                audio = audio.set_channels(1)  # Convert to mono
                audio = audio.set_frame_rate(16000)  # Set to 16kHz
                audio.export(wav_file_path, format='wav')
                
                print(f"Converted to WAV: {wav_file_path}")
                audio_path_for_diarization = wav_file_path
            else:
                audio_path_for_diarization = temp_file_path
        except Exception as e:
            print(f"Error converting audio: {str(e)}")
            raise Exception(f"Failed to convert audio format: {str(e)}")
        
        # Step 1: Transcribe using Whisper (works with original file)
        print("Transcribing audio...")
        transcription_result = model.transcribe(temp_file_path, fp16=False, word_timestamps=True)
        
        # Step 2: Perform speaker diarization (use converted WAV)
        print("Performing speaker diarization...")
        diarization = diarization_pipeline(audio_path_for_diarization)
        
        # Step 3: Combine transcription segments with speaker labels
        print("Combining transcription with speaker labels...")
        
        # Create a list of speaker segments
        speaker_segments = []
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            speaker_segments.append({
                "start": turn.start,
                "end": turn.end,
                "speaker": speaker
            })
        
        # Map speakers to Person 1, Person 2, etc.
        unique_speakers = sorted(set(seg["speaker"] for seg in speaker_segments))
        speaker_map = {speaker: f"Person {i+1}" for i, speaker in enumerate(unique_speakers)}
        
        # Assign speakers to transcription segments
        segments_with_speakers = []
        for segment in transcription_result.get("segments", []):
            segment_start = segment["start"]
            segment_end = segment["end"]
            segment_mid = (segment_start + segment_end) / 2
            
            # Find which speaker was talking at the midpoint of this segment
            assigned_speaker = "Unknown"
            for speaker_seg in speaker_segments:
                if speaker_seg["start"] <= segment_mid <= speaker_seg["end"]:
                    assigned_speaker = speaker_map[speaker_seg["speaker"]]
                    break
            
            segments_with_speakers.append({
                "start": segment_start,
                "end": segment_end,
                "text": segment["text"].strip(),
                "speaker": assigned_speaker
            })
        
        # Clean up temporary files
        os.unlink(temp_file_path)
        if wav_file_path and os.path.exists(wav_file_path):
            os.unlink(wav_file_path)
        
        # Create formatted transcript
        formatted_transcript = ""
        current_speaker = None
        current_text = []
        
        for seg in segments_with_speakers:
            if seg["speaker"] != current_speaker:
                if current_speaker is not None:
                    formatted_transcript += f"{current_speaker}: {' '.join(current_text)}\n\n"
                current_speaker = seg["speaker"]
                current_text = [seg["text"]]
            else:
                current_text.append(seg["text"])
        
        # Add the last speaker's text
        if current_speaker is not None:
            formatted_transcript += f"{current_speaker}: {' '.join(current_text)}"
        
        return {
            "success": True,
            "filename": file.filename,
            "full_text": transcription_result["text"],
            "formatted_transcript": formatted_transcript.strip(),
            "segments": segments_with_speakers,
            "num_speakers": len(unique_speakers),
            "speakers": list(speaker_map.values())
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass
        if 'wav_file_path' in locals() and wav_file_path and os.path.exists(wav_file_path):
            try:
                os.unlink(wav_file_path)
            except:
                pass
        raise
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(f"ERROR TYPE: {type(e).__name__}")
        print(traceback.format_exc())
        
        # Clean up temporary files
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as cleanup_error:
                print(f"Cleanup error: {str(cleanup_error)}")
        if 'wav_file_path' in locals() and wav_file_path and os.path.exists(wav_file_path):
            try:
                os.unlink(wav_file_path)
            except Exception as cleanup_error:
                print(f"WAV cleanup error: {str(cleanup_error)}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Transcription with diarization failed: {str(e)}"
        )


@app.post("/generate-clinical-note")
async def generate_clinical_note(data: Dict[Any, Any] = Body(...)):
    """
    Generate a structured clinical note from transcription using AI
    """
    
    try:
        transcript = data.get("transcript", "")
        formatted_transcript = data.get("formatted_transcript", "")
        
        if not transcript and not formatted_transcript:
            raise HTTPException(
                status_code=400,
                detail="Transcript is required"
            )
        
        # Use formatted transcript if available (with speaker labels), otherwise use plain transcript
        input_text = formatted_transcript if formatted_transcript else transcript
        
        # Get API key from environment
        do_api_key = os.environ.get("DO_AI_API_KEY")
        if not do_api_key:
            raise HTTPException(
                status_code=500,
                detail="DO_AI_API_KEY not configured in environment"
            )
        
        # System prompt for clinical note generation
        system_prompt = """You are a medical documentation assistant specializing in orthopedic consultations. Generate a structured clinical note following the SOAP format (Subjective, Objective, Assessment & Plan) based ONLY on information explicitly mentioned in the provided transcript. it shouldnt be just points and very brief. It should be a for    mal letter that we can email to the patient.

CRITICAL RULES:
- ONLY include information explicitly mentioned in the transcript
- NEVER invent or assume patient details, diagnoses, or treatment plans
- If a section has no relevant information from the transcript, OMIT that section entirely
- Do not add placeholder text or mention that information is missing
- Use the exact medical terminology from the transcript

FORMAT STRUCTURE:

Subjective:
- Reason(s) for consultation (only if mentioned)
- History of presenting complaint(s) (only if mentioned)
- Past medical and surgical history (only if mentioned)
- Current medications (only if mentioned)
- Social history relevant to musculoskeletal health (only if mentioned)
- Allergies (only if mentioned)

Objective:
- Vitals (only if mentioned)
- Physical examination findings (only if mentioned)
- Neurovascular examination findings (only if mentioned)
- Investigation results (only if mentioned)

Assessment & Plan:
For each condition mentioned:
- Assessment and diagnosis (only if discussed)
- Differential diagnosis (only if discussed)
- Planned investigations (only if discussed)
- Surgical treatment (only if discussed)
- Non-surgical management (only if discussed)
- Pre-operative preparation (only if discussed)
- Post-operative care plan (only if discussed)
- Referrals (only if discussed)

Additional Notes: (only if mentioned)
- Patient education provided (only if discussed)
- Instructions for care (only if discussed)
- Patient/family concerns (only if discussed)

Remember: If information is not in the transcript, completely omit that section. Do not use brackets, placeholders, or mention omissions."""

        # Call DigitalOcean AI API
        url = "https://inference.do-ai.run/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {do_api_key}"
        }
        payload = {
            "model": "openai-gpt-oss-20b",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"Generate a clinical note from this consultation transcript:\n\n{input_text}"
                }
            ],
            "max_tokens": 2000,
            "temperature": 0.3  # Lower temperature for more consistent medical documentation
        }
        
        print("Generating clinical note with AI...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            print(f"AI API Error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"AI API error: {response.text}"
            )
        
        result = response.json()
        print(result)
        clinical_note = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        if not clinical_note:
            raise Exception("No clinical note generated from AI")
        
        print("Clinical note generated successfully")
        
        return {
            "success": True,
            "clinical_note": clinical_note,
            "model": "openai-gpt-oss-20b"
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"ERROR generating clinical note: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate clinical note: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

