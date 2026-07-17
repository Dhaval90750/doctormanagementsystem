'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function DashboardOverview() {
  const [role, setRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role || 'USER');
        setUserEmail(user.email || '');

        // Start Onboarding Tour if first login
        if (!localStorage.getItem('tour_completed')) {
          const driverObj = driver({
            showProgress: true,
            steps: [
              { element: '#tour-welcome', popover: { title: 'Welcome to Scholaris!', description: 'Let us show you around your new intelligent dashboard.' } },
              { element: '#tour-stats', popover: { title: 'Your Stats', description: 'At a glance, see your attendance, XP, and streaks.' } },
              { element: '#tour-chart', popover: { title: 'Performance Trends', description: 'Interactive charts help you visualize your progress over time.' } },
            ]
          });
          
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            driverObj.drive();
            localStorage.setItem('tour_completed', 'true');
          }, 1000);
        }
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const adminData = [
    { name: 'Anatomy', students: 120 },
    { name: 'Physiology', students: 98 },
    { name: 'Biochem', students: 86 },
    { name: 'Pathology', students: 110 },
  ];
  
  const studentData = [
    { name: 'Week 1', attendance: 100 },
    { name: 'Week 2', attendance: 90 },
    { name: 'Week 3', attendance: 85 },
    { name: 'Week 4', attendance: 95 },
  ];

  if (!role) {
    return <div className="animate-pulse bg-slate-900 h-64 rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 id="tour-welcome" className="text-2xl font-bold">Welcome back, {userEmail}!</h1>
      
      {/* SUPER_ADMIN DASHBOARD */}
      {(role === 'SUPER_ADMIN' || role === 'INSTITUTION_ADMIN') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-400 mb-2">Total Colleges</h3>
              <p className="text-4xl font-bold text-white">4</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-400 mb-2">Active Departments</h3>
              <p className="text-4xl font-bold text-white">12</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-400 mb-2">Total Students</h3>
              <p className="text-4xl font-bold text-white">840</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-6">Students per Department</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* STUDENT DASHBOARD */}
      {(role === 'STUDENT_UG' || role === 'STUDENT_INTERN') && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div id="tour-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-violet-500/20">
              <h3 className="text-violet-200 mb-2 font-medium">Overall Attendance</h3>
              <p className="text-4xl font-bold text-white">92%</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-amber-500 to-orange-600 border border-orange-500/50 rounded-2xl p-6 shadow-lg shadow-orange-500/20">
              <h3 className="text-orange-100 mb-2 font-medium">Current Streak 🔥</h3>
              <p className="text-4xl font-bold text-white">7 Days</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-emerald-500 to-teal-600 border border-teal-500/50 rounded-2xl p-6 shadow-lg shadow-teal-500/20">
              <h3 className="text-teal-100 mb-2 font-medium">Total XP ⭐️</h3>
              <p className="text-4xl font-bold text-white">1,240</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-slate-400 mb-2">Unread Announcements</h3>
              <p className="text-4xl font-bold text-blue-400">2</p>
            </motion.div>
          </div>

          <div id="tour-chart" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-6">Attendance Trend</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* FACULTY DASHBOARD */}
      {(role === 'FACULTY' || role === 'HOD' || role === 'SENIOR_DOCTOR') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-400 mb-2">Today's Lectures</h3>
              <p className="text-4xl font-bold text-white">2</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-400 mb-2">Pending Evaluations</h3>
              <p className="text-4xl font-bold text-amber-400">14</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-400 mb-2">Avg Class Attendance</h3>
              <p className="text-4xl font-bold text-emerald-400">88%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
