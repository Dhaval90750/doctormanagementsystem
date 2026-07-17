'use client';

import { useState } from 'react';

const MOCK_VIDEOS = [
  { id: 'v1', title: 'Cardiovascular System - Part 1', duration: '45:20', progress: 80, thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?w=500&q=80' },
  { id: 'v2', title: 'Neuroanatomy Basics', duration: '52:10', progress: 30, thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=80' },
  { id: 'v3', title: 'Pharmacokinetics Intro', duration: '34:05', progress: 0, thumbnail: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80' },
];

export default function VideoLearningPage() {
  const [activeVideo, setActiveVideo] = useState(MOCK_VIDEOS[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Video Learning Library</h1>
          <p className="text-slate-400">Watch recorded lectures with HLS streaming.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Video Player Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video relative border border-slate-800 shadow-2xl group">
            {/* Mock Player */}
            <img src={activeVideo.thumbnail} alt="Video thumbnail" className="w-full h-full object-cover opacity-60" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-blue-600/90 hover:bg-blue-500 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110">
                <span className="text-white text-3xl ml-2">▶</span>
              </button>
            </div>

            {/* Fake progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
              <div className="h-full bg-blue-500" style={{ width: `${activeVideo.progress}%` }}></div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold">{activeVideo.title}</h2>
            <p className="text-slate-400 mt-2">Professor Smith • Department of Anatomy</p>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              This lecture covers the fundamental concepts required for your upcoming clinical rotations. Make sure to complete the attached quiz after watching.
            </p>
          </div>
        </div>

        {/* Playlist / Up Next */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit">
          <h3 className="font-bold text-lg mb-4">Up Next</h3>
          <div className="space-y-4">
            {MOCK_VIDEOS.map(video => (
              <div 
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-colors ${activeVideo.id === video.id ? 'bg-slate-800 border-blue-500/30 border' : 'hover:bg-slate-800 border border-transparent'}`}
              >
                <div className="w-32 aspect-video bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-[10px] rounded text-white font-medium">
                    {video.duration}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-medium text-sm line-clamp-2 leading-tight">{video.title}</h4>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${video.progress}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">{video.progress}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
