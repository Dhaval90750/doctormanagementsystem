'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FileUp, Clock, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // Mock fetching assignments for the student's current topic/course
  // In a real app, this would query assignments assigned to the student's section
  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Let's mock a fetch by just getting some mock topic's assignments, or we can just fetch all assignments for now
      // Assuming there's a backend endpoint for this. We'll use a mock array if API fails
      setAssignments([
        { id: '1', title: 'Anatomy Lab Report 1', description: 'Submit your findings from the cardiovascular dissection.', dueDate: new Date().toISOString(), maxMarks: 100 }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const payload = {
        assignmentId: selectedAssignment.id,
        content: submissionText,
        fileUrl: fileUrl
      };
      
      const res = await fetch(`${API_BASE_URL}/assignments/submit`, {
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
        toast.success('Assignment submitted successfully!');
        setSelectedAssignment(null);
        setSubmissionText('');
        setFileUrl('');
      } else {
        toast.error('Failed to submit assignment');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Assignments</h1>
          <p className="text-slate-400">View pending assignments and submit your work.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(a => (
          <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{a.description}</p>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-emerald-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                {a.maxMarks} Marks
              </span>
              <span className="text-amber-400 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Due: {new Date(a.dueDate).toLocaleDateString()}
              </span>
            </div>
            <button 
              onClick={() => setSelectedAssignment(a)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors flex justify-center items-center font-medium shadow-lg shadow-indigo-500/20"
            >
              <FileUp className="w-4 h-4 mr-2" />
              Submit Work
            </button>
          </div>
        ))}
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Submit: {selectedAssignment.title}</h2>
            <p className="text-sm text-slate-400 mb-6">{selectedAssignment.description}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Text Submission</label>
                <textarea 
                  required 
                  rows={6} 
                  placeholder="Type your answer here..."
                  value={submissionText} 
                  onChange={e => setSubmissionText(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">File URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://drive.google.com/..."
                  value={fileUrl} 
                  onChange={e => setFileUrl(e.target.value)} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setSelectedAssignment(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center">
                  <FileUp className="w-4 h-4 mr-2" />
                  Turn In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
