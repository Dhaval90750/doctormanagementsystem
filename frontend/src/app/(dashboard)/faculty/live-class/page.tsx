'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, Settings, MonitorUp, Captions } from 'lucide-react';

export default function LiveClassPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isLive, setIsLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  
  const [subtitles, setSubtitles] = useState<string>('');
  const [showCaptions, setShowCaptions] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const toggleLive = () => {
    if (!isLive) {
      setIsLive(true);
      // Start listening to mock transcriptions
      eventSourceRef.current = new EventSource('http://localhost:8080/api/v1/webrtc/transcription/mock-class-id');
      eventSourceRef.current.addEventListener('transcription', (event) => {
        setSubtitles(event.data);
      });
    } else {
      setIsLive(false);
      setSubtitles('');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Class & Telemedicine</h1>
          <p className="text-slate-400">WebRTC powered ultra-low latency streaming.</p>
        </div>
        <button 
          onClick={toggleLive}
          className={`px-6 py-2 rounded-xl text-white font-bold shadow-lg transition-all ${
            isLive 
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 animate-pulse' 
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
          }`}
        >
          {isLive ? 'END CLASS' : 'GO LIVE'}
        </button>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
        {/* Video Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {isLive ? (
            camOn ? (
              <div className="w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  className="w-full h-full object-cover opacity-80"
                  alt="Live Feed"
                />
                <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                  LIVE
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-4xl mb-4">
                  👨‍⚕️
                </div>
                <p className="text-slate-400">Camera is off</p>
              </div>
            )
          ) : (
            <div className="text-slate-500 flex flex-col items-center">
              <Video className="w-16 h-16 mb-4 opacity-50" />
              <p>Start the class to begin streaming</p>
            </div>
          )}

          {/* Subtitles Overlay */}
          <AnimatePresence>
            {isLive && showCaptions && subtitles && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none"
              >
                <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-2xl max-w-2xl border border-white/10 shadow-2xl text-center">
                  <p className="text-xl font-medium text-white tracking-wide">{subtitles}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Bar */}
        <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center space-x-4 px-6">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-full transition-colors ${micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setCamOn(!camOn)}
            className={`p-4 rounded-full transition-colors ${camOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
          >
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <div className="w-px h-8 bg-slate-800 mx-2"></div>

          <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors" title="Share Screen">
            <MonitorUp className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowCaptions(!showCaptions)}
            className={`p-4 rounded-full transition-colors ${showCaptions ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`} 
            title="Toggle Live Transcriptions (Whisper API)"
          >
            <Captions className="w-5 h-5" />
          </button>

          <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
