"use client";

import { Loader2, FileText, Users, Sparkles } from "lucide-react";
import axios from "axios";

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  speaker: string;
}

interface TranscriptDisplayProps {
  transcript: string;
  formattedTranscript?: string;
  segments?: TranscriptSegment[];
  numSpeakers?: number;
  speakers?: string[];
  clinicalNote: string;
  onGenerateClinicalNote: (note: string) => void;
  isLoading: boolean;
  isGeneratingNote: boolean;
  setIsGeneratingNote: (loading: boolean) => void;
  activeTab: "transcript" | "context" | "note";
}

export default function TranscriptDisplay({ 
  transcript, 
  formattedTranscript, 
  segments, 
  numSpeakers, 
  speakers,
  clinicalNote,
  onGenerateClinicalNote,
  isLoading,
  isGeneratingNote,
  setIsGeneratingNote,
  activeTab 
}: TranscriptDisplayProps) {
  
  const handleGenerateClinicalNote = async () => {
    setIsGeneratingNote(true);
    try {
      const response = await axios.post("http://localhost:8000/generate-clinical-note", {
        transcript: transcript,
        formatted_transcript: formattedTranscript
      });
      
      if (response.data && response.data.clinical_note) {
        onGenerateClinicalNote(response.data.clinical_note);
      }
    } catch (error) {
      console.error("Error generating clinical note:", error);
      alert("Failed to generate clinical note. Please make sure the API is running.");
    } finally {
      setIsGeneratingNote(false);
    }
  };
  // Handle Note tab
  if (activeTab === "note") {
    if (isGeneratingNote) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
            <p className="text-lg text-gray-600">Generating clinical note...</p>
            <p className="text-sm text-gray-500">Using AI to structure the consultation</p>
          </div>
        </div>
      );
    }

    if (!clinicalNote) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center">
                <FileText className="w-16 h-16 text-purple-600" />
              </div>
            </div>
            
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No clinical note generated yet
              </h2>
              <p className="text-gray-600 mb-6">
                {transcript ? "Click the button below to generate a structured clinical note from the transcript" : "Record a consultation first to generate a clinical note"}
              </p>
              
              {transcript && (
                <button
                  onClick={handleGenerateClinicalNote}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Clinical Note
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Display the generated clinical note
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Clinical Note</h2>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateClinicalNote}
                disabled={isGeneratingNote}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                Regenerate
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(clinicalNote);
                  alert("Clinical note copied to clipboard!");
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {clinicalNote}
            </pre>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Generated at {new Date().toLocaleString()}
            </span>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Context tab
  if (activeTab === "context") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg">This section is under development</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-lg text-gray-600">Transcribing audio...</p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center">
              <FileText className="w-16 h-16 text-purple-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path
                  d="M60 10 Q70 20, 70 30"
                  stroke="#9333EA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M70 30 L75 25 M70 30 L65 28"
                  stroke="#9333EA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Start this session using the header
            </h2>
            <p className="text-gray-600">
              Your note will appear here once your session is complete
            </p>
          </div>

          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg max-w-lg">
            <p className="text-sm text-orange-800 text-center">
              ⚠️ Review your note before use to ensure it accurately represents the visit
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasSpeakerInfo = segments && segments.length > 0 && numSpeakers && numSpeakers > 1;

  const getSpeakerColor = (speaker: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-300",
      "bg-green-100 text-green-800 border-green-300",
      "bg-purple-100 text-purple-800 border-purple-300",
      "bg-orange-100 text-orange-800 border-orange-300",
      "bg-pink-100 text-pink-800 border-pink-300",
    ];
    const index = parseInt(speaker.replace(/\D/g, "")) - 1;
    return colors[index % colors.length];
  };

  const copyToClipboard = () => {
    const textToCopy = formattedTranscript || transcript;
    navigator.clipboard.writeText(textToCopy);
    alert("Transcript copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Transcript Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Transcription</h2>
            {hasSpeakerInfo && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                <Users className="w-4 h-4" />
                {numSpeakers} {numSpeakers === 1 ? "Speaker" : "Speakers"}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerateClinicalNote}
              disabled={isGeneratingNote}
              className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Generate Note
            </button>
            <button 
              onClick={copyToClipboard}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Copy
            </button>
          </div>
        </div>
        
        {/* Speaker Legend */}
        {hasSpeakerInfo && speakers && (
          <div className="mt-3 flex flex-wrap gap-2">
            {speakers.map((speaker) => (
              <span
                key={speaker}
                className={`px-3 py-1 rounded-md text-xs font-medium border ${getSpeakerColor(speaker)}`}
              >
                {speaker}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Transcript Content */}
      <div className="p-6">
        <div className="prose max-w-none">
          {hasSpeakerInfo && segments ? (
            /* Render with speaker segments */
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <div key={index} className="flex gap-3">
                  <span className={`flex-shrink-0 px-3 py-1 rounded-md text-sm font-medium border ${getSpeakerColor(segment.speaker)}`}>
                    {segment.speaker}
                  </span>
                  <p className="text-gray-800 leading-relaxed flex-1">
                    {segment.text}
                  </p>
                </div>
              ))}
            </div>
          ) : formattedTranscript ? (
            /* Render formatted transcript with line breaks */
            <div className="space-y-4">
              {formattedTranscript.split('\n\n').map((paragraph, index) => {
                const match = paragraph.match(/^(Person \d+): (.[\s\S]*)$/);
                if (match) {
                  const [, speaker, text] = match;
                  return (
                    <div key={index} className="flex gap-3">
                      <span className={`flex-shrink-0 px-3 py-1 rounded-md text-sm font-medium border ${getSpeakerColor(speaker)}`}>
                        {speaker}
                      </span>
                      <p className="text-gray-800 leading-relaxed flex-1">
                        {text}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={index} className="text-gray-800 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          ) : (
            /* Fallback to plain transcript */
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {transcript}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Transcribed at {new Date().toLocaleString()}
          </span>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

