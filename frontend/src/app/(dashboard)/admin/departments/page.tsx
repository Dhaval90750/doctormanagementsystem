'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function ManageDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', isClinical: false });

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = JSON.parse(localStorage.getItem('user') || '{}')?.tenantId || 'platform';
      const res = await fetch(`${API_BASE_URL}/departments`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId 
        }
      });
      const data = await res.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = JSON.parse(localStorage.getItem('user') || '{}')?.tenantId || 'platform';
      const res = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ name: '', code: '', description: '', isClinical: false });
        toast.success('Department created successfully!');
        fetchDepartments();
      } else {
        toast.error(data.error?.message || 'Failed to create department');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Departments</h1>
          <p className="text-slate-400">Configure academic and clinical departments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors shadow-lg shadow-violet-500/20"
        >
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-12" />
              </div>
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))
        ) : (
          departments.map((dept) => (
            <div key={dept.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{dept.name}</h3>
                <span className="px-2 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-lg border border-violet-500/20">
                  {dept.code}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <p className="line-clamp-2">{dept.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                  <span>{dept.isClinical ? '🏥 Clinical' : '📚 Academic'}</span>
                  {dept.hodId && <span className="text-blue-400">HOD Assigned</span>}
                </div>
              </div>
            </div>
          ))
        )}
        {!isLoading && departments.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
            No departments found.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Add Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Department Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Code (e.g., MED)</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isClinical" checked={formData.isClinical} onChange={e => setFormData({...formData, isClinical: e.target.checked})} className="rounded bg-slate-800 border-slate-700 text-violet-500 focus:ring-violet-500" />
                <label htmlFor="isClinical" className="text-sm text-slate-400">This is a Clinical Department</label>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
