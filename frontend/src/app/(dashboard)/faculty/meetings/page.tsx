'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', startTime: '', endTime: '', locationOrLink: ''
  });

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = JSON.parse(localStorage.getItem('user') || '{}')?.tenantId || 'platform';
      const res = await fetch(`${API_BASE_URL}/meetings`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId 
        }
      });
      const data = await res.json();
      if (data.success) {
        setMeetings(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const tenantId = user?.tenantId || 'platform';
      
      const payload = {
        ...formData,
        organizerId: user?.id,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      const res = await fetch(`${API_BASE_URL}/meetings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ title: '', description: '', startTime: '', endTime: '', locationOrLink: '' });
        fetchMeetings();
      } else {
        alert(data.error?.message || 'Failed to create meeting');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Faculty Meetings</h1>
          <p className="text-slate-400">Schedule meetings, track minutes, and assign action items.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-colors shadow-lg shadow-pink-500/20"
        >
          + Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <h3 className="font-semibold text-lg text-white mb-2">{meeting.title}</h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{meeting.description}</p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <span>🗓</span>
                <span>{new Date(meeting.startTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span className="text-pink-400 truncate">{meeting.locationOrLink || 'TBA'}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between">
              <button className="text-sm text-blue-400 hover:text-blue-300">View Minutes</button>
              <span className="text-sm px-2 py-1 bg-slate-800 rounded-md text-slate-300">RSVP: Pending</span>
            </div>
          </div>
        ))}
        {meetings.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
            No meetings scheduled.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Schedule Meeting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Start Time</label>
                  <input required type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">End Time</label>
                  <input required type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Location or Link</label>
                <input type="text" value={formData.locationOrLink} onChange={e => setFormData({...formData, locationOrLink: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
