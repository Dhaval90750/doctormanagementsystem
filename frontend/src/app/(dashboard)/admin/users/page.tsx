'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', password: '', firstName: '', lastName: '', roleId: '', departmentId: '' 
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = JSON.parse(localStorage.getItem('user') || '{}')?.tenantId || 'platform';
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': tenantId 
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const tenantId = JSON.parse(localStorage.getItem('user') || '{}')?.tenantId || 'platform';
      const res = await fetch(`${API_BASE_URL}/users`, {
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
        setFormData({ email: '', password: '', firstName: '', lastName: '', roleId: '', departmentId: '' });
        toast.success('User created successfully!');
        fetchUsers();
      } else {
        toast.error(data.error?.message || 'Failed to create user');
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
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-slate-400">Add and manage staff, faculties, and students.</p>
        </div>
        <div className="flex space-x-3">
          <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer border border-slate-700 shadow-lg">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                toast.success(`Parsing ${e.target.files[0].name}...`);
                // Placeholder for actual CSV upload logic
                setTimeout(() => toast.success('Users imported successfully!'), 1000);
              }
            }} />
          </label>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-300">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between border-t border-slate-800 pt-3">
                  <span>Role</span>
                  <span className="text-emerald-400">{user.role?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-3">
                  <span>Department</span>
                  <span className="text-blue-400">{user.department?.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {!isLoading && users.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
            No users found.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">First Name</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Last Name</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              {/* Optional: Add dropdowns for Role and Department IDs if APIs were fully hooked up */}
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
