'use client';

import { useState, useRef, useEffect } from 'react';

export default function LiveClassPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Initialize local stream
  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    setupMedia();

    return () => {
      // Cleanup streams on unmount
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(t => t.enabled = !micOn);
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(t => t.enabled = !videoOn);
      setVideoOn(!videoOn);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Telemedicine / Live Class</h1>
          <p className="text-slate-400">WebRTC Powered Real-Time Communication.</p>
        </div>
        <button 
          onClick={() => setInCall(!inCall)}
          className={`px-6 py-2 text-white rounded-xl transition-all shadow-lg font-medium ${inCall ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'}`}
        >
          {inCall ? 'End Session' : 'Start Session'}
        </button>
      </div>

      <div className="flex-1 bg-black rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
        {/* Remote Video (Full Screen) */}
        {inCall ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
             <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-500 text-lg bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md">Waiting for participants...</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
             <span className="text-slate-500 text-lg">Session has not started.</span>
          </div>
        )}

        {/* Local Video (PiP) */}
        <div className="absolute bottom-6 right-6 w-64 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-300 ${videoOn ? 'opacity-100' : 'opacity-0'}`}
          />
          {!videoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <span className="text-slate-400 font-medium">Video Off</span>
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10">
          <button 
            onClick={toggleMic}
            className={`p-4 rounded-xl transition-all ${micOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-red-500/80 hover:bg-red-400'}`}
          >
            {micOn ? '🎤 Mic On' : '🔇 Mic Off'}
          </button>
          <button 
            onClick={toggleVideo}
            className={`p-4 rounded-xl transition-all ${videoOn ? 'bg-slate-700/80 hover:bg-slate-600' : 'bg-red-500/80 hover:bg-red-400'}`}
          >
            {videoOn ? '📹 Video On' : '🚫 Video Off'}
          </button>
          <button className="p-4 rounded-xl bg-blue-600/80 hover:bg-blue-500 transition-all text-white font-medium">
            ⬆️ Share Screen
          </button>
        </div>
      </div>
    </div>
  );
}
