'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function AttendancePage() {
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [qrPayload, setQrPayload] = useState<string | null>(null);

  // Mock sessions for demonstration
  const mockSessions = [
    { id: '123e4567-e89b-12d3-a456-426614174000', title: 'Anatomy Lecture - Intro to Thorax', time: '10:00 AM - 11:00 AM' },
    { id: '123e4567-e89b-12d3-a456-426614174001', title: 'Clinical Posting - Medicine Ward', time: '11:30 AM - 01:00 PM' }
  ];

  const handleGenerateQR = () => {
    if (!selectedSession) return;
    
    // In production, this would be a secure, time-sensitive token fetched from the backend
    const payload = JSON.stringify({
      sessionId: selectedSession,
      timestamp: Date.now(),
      type: 'ATTENDANCE_MARKER'
    });
    setQrPayload(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-slate-400">Generate QR code or mark attendance manually.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Session Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">Select Session</h2>
          <div className="space-y-4">
            {mockSessions.map((session) => (
              <div 
                key={session.id} 
                onClick={() => setSelectedSession(session.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSession === session.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{session.title}</h3>
                  <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                    {selectedSession === session.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-1">{session.time}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={handleGenerateQR}
            disabled={!selectedSession}
            className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Generate QR Code for Students
          </button>
        </div>

        {/* QR Code Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          {qrPayload ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-xl font-semibold text-blue-400">Scan to Mark Attendance</h2>
              <div className="bg-white p-6 rounded-2xl inline-block shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <QRCodeSVG value={qrPayload} size={256} level="H" />
              </div>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Ask students to scan this code using their DSMS mobile app. The code refreshes dynamically.
              </p>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center">
                QR
              </div>
              <p>Select a session to generate QR code</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
