'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);

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
        <div className="p-6 border-b border-slate-800 flex flex-col items-start">
          <Image src="/scholaris-full-logo.png" alt="Scholaris Logo" width={160} height={40} className="mb-2" />
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
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-8">
          <div className="flex items-center text-slate-400 bg-slate-800/50 px-4 py-1.5 rounded-full text-sm border border-slate-700/50">
            <Search className="w-4 h-4 mr-2" />
            <span>Press <kbd className="font-mono text-slate-300">Cmd+K</kbd> to search</span>
          </div>
          
          <div className="flex items-center space-x-6 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-12 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-700 font-medium">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer">
                      <p className="text-sm font-medium text-slate-200">Welcome to Scholaris!</p>
                      <p className="text-xs text-slate-400 mt-1">Please complete your profile.</p>
                    </div>
                    <div className="p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer">
                      <p className="text-sm font-medium text-slate-200">System Update</p>
                      <p className="text-xs text-slate-400 mt-1">Version 2.0 deployed.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold shadow-lg">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
