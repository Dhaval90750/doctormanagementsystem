'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Video as VideoIcon, Clock, HardDriveDownload } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function VideoLearningPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // Mock data since FFmpeg pipeline is not fully implemented locally
  const mockVideos = [
    {
      id: '1',
      title: 'Introduction to Cardiovascular Anatomy',
      description: 'A deep dive into the four chambers of the heart and major vessels.',
      durationSeconds: 2450,
      status: 'READY',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hlsPlaylistUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Public sample video for demo
    },
    {
      id: '2',
      title: 'Surgical Techniques: Suture Basics',
      description: 'Learn the fundamental knot-tying and suturing techniques required in the ER.',
      durationSeconds: 1820,
      status: 'PROCESSING',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551076805-e1869043e560?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hlsPlaylistUrl: null
    }
  ];

  useEffect(() => {
    // In real app, fetch from /api/v1/videos
    setVideos(mockVideos);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Video Learning Library</h1>
          <p className="text-slate-400">On-demand access to recorded lectures and clinical procedures.</p>
        </div>
      </div>

      {selectedVideo ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video bg-black relative flex items-center justify-center">
            {/* Using a standard HTML5 video element for the mock HLS/MP4 playback */}
            <video 
              src={selectedVideo.hlsPlaylistUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
              poster={selectedVideo.thumbnailUrl}
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                <div className="flex space-x-4 text-sm text-slate-400">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {formatDuration(selectedVideo.durationSeconds)}</span>
                  <span className="flex items-center"><HardDriveDownload className="w-4 h-4 mr-1" /> HD Transcoded</span>
                </div>
              </div>
              <button onClick={() => setSelectedVideo(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
                Back to Library
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed">{selectedVideo.description}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
            <div 
              key={v.id} 
              className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer shadow-lg"
              onClick={() => {
                if (v.status === 'READY') {
                  setSelectedVideo(v);
                } else {
                  toast.info('Video is still processing in the FFmpeg pipeline. Please wait.');
                }
              }}
            >
              <div className="aspect-video relative overflow-hidden bg-slate-800">
                <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {v.status === 'READY' ? (
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                  ) : (
                    <span className="px-4 py-2 bg-black/60 rounded-full text-white font-medium flex items-center backdrop-blur-sm border border-slate-600">
                      Processing...
                    </span>
                  )}
                </div>
                {v.status === 'READY' && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs font-medium text-white backdrop-blur-sm">
                    {formatDuration(v.durationSeconds)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white mb-2 line-clamp-2">{v.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
