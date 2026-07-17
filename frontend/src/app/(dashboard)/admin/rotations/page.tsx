'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Calendar, UserPlus, ClipboardList } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function ClinicalRotationsPage() {
  const [rotations, setRotations] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', departmentId: '', supervisorId: '', startDate: '', endDate: '' });

  const fetchRotations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      // Mock department ID for now
      const departmentId = '00000000-0000-0000-0000-000000000000';
      const res = await fetch(`${API_BASE_URL}/rotations/department/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRotations(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRotations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };
      
      const res = await fetch(`${API_BASE_URL}/rotations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Rotation schedule created!');
        setShowAddModal(false);
        fetchRotations();
      } else {
        toast.error('Failed to create rotation');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clinical Rotations</h1>
          <p className="text-slate-400">Manage ward rosters and clinical assignments for residents.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-medium"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Rotation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rotations.map(r => (
          <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
            <div className="space-y-2 text-sm text-slate-400 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <ClipboardList className="w-4 h-4 mr-2 text-blue-500" />
                Supervisor ID: {r.supervisorId}
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center justify-center text-sm font-medium">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Student
              </button>
            </div>
          </div>
        ))}
        {rotations.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No clinical rotations scheduled yet.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Schedule Rotation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Rotation Title / Ward Name</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Department ID (Mock)</label>
                <input required type="text" value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Supervisor ID (Mock)</label>
                <input required type="text" value={formData.supervisorId} onChange={e => setFormData({...formData, supervisorId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
