"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, ChevronDown, Upload, Clock } from "lucide-react";
import axios from "axios";

interface TranscriptionData {
  text: string;
  formattedTranscript?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
    speaker: string;
  }>;
  numSpeakers?: number;
  speakers?: string[];
}

interface VoiceRecorderProps {
  onTranscriptionComplete: (data: TranscriptionData) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function VoiceRecorder({ onTranscriptionComplete, onLoadingChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState<"transcribing" | "dictating" | "upload">("transcribing");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      visualizeAudio();

      // Try to use audio/webm codec, fallback to default
      let options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Use the actual MIME type from the recorder
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await sendAudioToAPI(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100 * 3));
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAudioLevel(0);
    }
  };

  const sendAudioToAPI = async (audioBlob: Blob) => {
    onLoadingChange(true);
    const formData = new FormData();
    
    // Determine file extension based on MIME type
    let filename = "recording.webm";
    if (audioBlob.type.includes("mp4")) {
      filename = "recording.mp4";
    } else if (audioBlob.type.includes("ogg")) {
      filename = "recording.ogg";
    } else if (audioBlob.type.includes("wav")) {
      filename = "recording.wav";
    }
    
    formData.append("file", audioBlob, filename);

    try {
      // Try diarization endpoint first
      const response = await axios.post("http://localhost:8000/transcribe/diarize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        const transcriptionData: TranscriptionData = {
          text: response.data.full_text || response.data.text || "",
          formattedTranscript: response.data.formatted_transcript,
          segments: response.data.segments,
          numSpeakers: response.data.num_speakers,
          speakers: response.data.speakers,
        };
        onTranscriptionComplete(transcriptionData);
      }
    } catch (error: any) {
      console.error("Error with diarization, trying simple transcription:", error);
      
      // Fallback to simple transcription if diarization fails
      try {
        const fallbackResponse = await axios.post("http://localhost:8000/transcribe/simple", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (fallbackResponse.data && fallbackResponse.data.text) {
          onTranscriptionComplete({ text: fallbackResponse.data.text });
        }
      } catch (fallbackError) {
        console.error("Error sending audio to API:", fallbackError);
        alert("Failed to transcribe audio. Please make sure the API is running on http://localhost:8000");
      }
    } finally {
      onLoadingChange(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onLoadingChange(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Try diarization endpoint first
      const response = await axios.post("http://localhost:8000/transcribe/diarize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        const transcriptionData: TranscriptionData = {
          text: response.data.full_text || response.data.text || "",
          formattedTranscript: response.data.formatted_transcript,
          segments: response.data.segments,
          numSpeakers: response.data.num_speakers,
          speakers: response.data.speakers,
        };
        onTranscriptionComplete(transcriptionData);
      }
    } catch (error) {
      console.error("Error with diarization, trying simple transcription:", error);
      
      // Fallback to simple transcription if diarization fails
      try {
        const fallbackResponse = await axios.post("http://localhost:8000/transcribe/simple", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (fallbackResponse.data && fallbackResponse.data.text) {
          onTranscriptionComplete({ text: fallbackResponse.data.text });
        }
      } catch (fallbackError) {
        console.error("Error uploading audio:", fallbackError);
        alert("Failed to transcribe audio. Please make sure the API is running.");
      }
    } finally {
      onLoadingChange(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4">
      {/* Timer and Audio Level */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatTime(recordingTime)}</span>
        </div>
        
        {/* Audio Level Indicator */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-4 rounded-full transition-all ${
                audioLevel > (i * 20) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Recording Button with Dropdown */}
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" fill="currentColor" />
              Stop recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start transcribing
            </>
          )}
        </button>

        <button
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Toggle recording options"
          className={`ml-1 px-2 py-2.5 rounded-lg font-medium text-white transition-all ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
            <button
              onClick={() => {
                setMode("transcribing");
                setShowDropdown(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                mode === "transcribing" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Transcribing
            </button>
            <button
              onClick={() => {
                setMode("dictating");
                setShowDropdown(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                mode === "dictating" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Dictating
            </button>
            <label
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload session audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

