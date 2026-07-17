'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            DSMS
          </h2>
          <p className="text-xs text-slate-400 mt-1">{user.role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {user.role === 'SUPER_ADMIN' && (
            <>
              <Link href="/admin/colleges" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Manage Colleges
              </Link>
              <Link href="/admin/departments" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Manage Departments
              </Link>
              <Link href="/admin/users" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Manage Users
              </Link>
              <Link href="/admin/analytics" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Reporting & Analytics
              </Link>
            </>
          )}
          {(user.role === 'PROFESSOR' || user.role === 'ASSISTANT_PROFESSOR' || user.role === 'SUPER_ADMIN') && (
            <>
              <Link href="/faculty/attendance" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Attendance & QR
              </Link>
              <Link href="/faculty/assessments" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Assessments Entry
              </Link>
              <Link href="/faculty/meetings" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Meetings & Notes
              </Link>
              <Link href="/faculty/live-class" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Live Class / Telemedicine
              </Link>
            </>
          )}
          {(!user.role || user.role === 'STUDENT' || user.role === 'RESIDENT') && (
            <Link href="/student/video-learning" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
              Video Learning Library
            </Link>
          )}
          <Link href="/dashboard" className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            Dashboard Overview
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => {
              localStorage.clear();
              router.push('/login');
            }}
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center px-8">
          <h1 className="text-lg font-medium">Welcome, {user.email}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
