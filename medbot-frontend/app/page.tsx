"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import { Calendar, Globe } from "lucide-react";

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

export default function Home() {
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionData>({ text: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "context" | "note">("transcript");

  const handleTranscriptionComplete = (data: TranscriptionData) => {
    setTranscriptionData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Add patient details
            </h1>
          </div>
          
          <VoiceRecorder 
            onTranscriptionComplete={handleTranscriptionComplete}
            onLoadingChange={setIsLoading}
          />
        </div>
      </header>

      {/* Sub-header with metadata */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Today {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </div>
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            14 days
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("transcript")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "transcript"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab("context")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "context"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Context
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "note"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Note
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <TranscriptDisplay 
          transcript={transcriptionData.text}
          formattedTranscript={transcriptionData.formattedTranscript}
          segments={transcriptionData.segments}
          numSpeakers={transcriptionData.numSpeakers}
          speakers={transcriptionData.speakers}
          isLoading={isLoading}
          activeTab={activeTab}
        />
      </main>
    </div>
  );
}

