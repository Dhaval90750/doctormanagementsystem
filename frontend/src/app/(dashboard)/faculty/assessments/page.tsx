'use client';

import { useState } from 'react';

// Mock students data for the grid
const MOCK_STUDENTS = [
  { id: '1', name: 'John Doe', rollNo: 'MBBS-2023-01' },
  { id: '2', name: 'Jane Smith', rollNo: 'MBBS-2023-02' },
  { id: '3', name: 'Alice Johnson', rollNo: 'MBBS-2023-03' },
];

export default function AssessmentGridPage() {
  const [assessmentData, setAssessmentData] = useState({
    title: '', type: 'PRACTICAL', date: '', maxMarks: 100
  });

  const [marks, setMarks] = useState<Record<string, { marks: number | '', absent: boolean, remarks: string }>>(() => {
    const initial: any = {};
    MOCK_STUDENTS.forEach(s => {
      initial[s.id] = { marks: '', absent: false, remarks: '' };
    });
    return initial;
  });

  const handleMarkChange = (studentId: string, field: string, value: any) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Normally this would POST to /api/v1/assessments/results
    alert('Assessment results saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Offline Assessment Entry</h1>
          <p className="text-slate-400">Record marks for practicals, vivas, and clinical evaluations.</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all">
          Save Results
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-semibold mb-4">Assessment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title</label>
            <input type="text" placeholder="e.g. End of Posting Viva" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Type</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500">
              <option>PRACTICAL</option>
              <option>VIVA</option>
              <option>CLINICAL</option>
              <option>WRITTEN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Date</label>
            <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Max Marks</label>
            <input type="number" defaultValue={100} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="p-4 font-semibold text-slate-300">Roll No</th>
              <th className="p-4 font-semibold text-slate-300">Student Name</th>
              <th className="p-4 font-semibold text-slate-300 w-32">Absent</th>
              <th className="p-4 font-semibold text-slate-300 w-48">Marks Obtained</th>
              <th className="p-4 font-semibold text-slate-300">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map((student) => (
              <tr key={student.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="p-4 text-slate-400">{student.rollNo}</td>
                <td className="p-4 font-medium">{student.name}</td>
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={marks[student.id].absent} 
                    onChange={e => handleMarkChange(student.id, 'absent', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    disabled={marks[student.id].absent}
                    value={marks[student.id].marks}
                    onChange={e => handleMarkChange(student.id, 'marks', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={marks[student.id].remarks}
                    onChange={e => handleMarkChange(student.id, 'remarks', e.target.value)}
                    placeholder="Optional notes"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-emerald-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
