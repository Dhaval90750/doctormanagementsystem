'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function ManageCollegesPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', universityAffiliation: '', contactEmail: '' });

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/colleges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setColleges(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/colleges`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ name: '', code: '', universityAffiliation: '', contactEmail: '' });
        fetchColleges();
      } else {
        alert(data.error?.message || 'Failed to create college');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Colleges</h1>
          <p className="text-slate-400">Onboard and manage medical institutions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          + Add New College
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <div key={college.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{college.name}</h3>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg border border-blue-500/20">
                {college.code}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <p><span className="text-slate-500">Affiliation:</span> {college.universityAffiliation || 'N/A'}</p>
              <p><span className="text-slate-500">Contact:</span> {college.contactEmail || 'N/A'}</p>
              <p><span className="text-slate-500">Schema:</span> <code className="text-violet-400 bg-violet-400/10 px-1 rounded">{college.schemaName}</code></p>
            </div>
          </div>
        ))}
        {colleges.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
            No colleges registered yet.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Add New College</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">College Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">College Code (e.g., KMC)</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">University Affiliation</label>
                <input type="text" value={formData.universityAffiliation} onChange={e => setFormData({...formData, universityAffiliation: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Contact Email</label>
                <input type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">Register College</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
