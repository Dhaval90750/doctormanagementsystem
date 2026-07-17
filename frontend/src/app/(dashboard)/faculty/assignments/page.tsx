'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlusCircle, FileText, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function FacultyAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', maxMarks: 100, topicId: '' });

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch(`${API_BASE_URL}/assignments/faculty/${user.id}`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Tenant-ID': user.tenantId || 'platform' }
      });
      const data = await res.json();
      if (data.success) setAssignments(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };
      
      const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
          'X-Tenant-ID': user.tenantId || 'platform',
          'X-User-ID': user.id
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Assignment created!');
        setShowAddModal(false);
        fetchAssignments();
      } else {
        toast.error('Failed to create assignment');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Assignments</h1>
          <p className="text-slate-400">Create assignments and grade student submissions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-lg shadow-violet-500/20"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(a => (
          <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{a.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-emerald-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                {a.maxMarks} Marks
              </span>
              <span className="text-rose-400 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Due: {new Date(a.dueDate).toLocaleDateString()}
              </span>
            </div>
            <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
              View Submissions
            </button>
          </div>
        ))}
        {assignments.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No assignments created yet.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Create Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-violet-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                  <input required type="datetime-local" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-violet-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Max Marks</label>
                  <input required type="number" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-violet-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Topic ID (Mock)</label>
                <input required type="text" value={formData.topicId} onChange={e => setFormData({...formData, topicId: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-violet-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
