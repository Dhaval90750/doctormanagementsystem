'use client';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reporting & Analytics</h1>
          <p className="text-slate-400">Institutional performance, attendance, and video engagement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium">Average Attendance</h3>
          <p className="text-3xl font-bold text-white mt-2">87.4%</p>
          <span className="text-emerald-500 text-xs mt-2 inline-block">↑ 2.1% from last month</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium">Video Hours Watched</h3>
          <p className="text-3xl font-bold text-white mt-2">1,240</p>
          <span className="text-emerald-500 text-xs mt-2 inline-block">↑ 15% from last month</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium">Avg Assessment Score</h3>
          <p className="text-3xl font-bold text-white mt-2">72/100</p>
          <span className="text-red-500 text-xs mt-2 inline-block">↓ 1.4% from last month</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm font-medium">Active Students</h3>
          <p className="text-3xl font-bold text-white mt-2">850</p>
          <span className="text-slate-500 text-xs mt-2 inline-block">Steady</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold w-full text-left mb-6">Attendance Trends</h3>
          <div className="w-full flex-1 flex items-end space-x-2">
            {/* Mock Bar Chart */}
            {[60, 70, 85, 75, 90, 88, 92].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm relative group cursor-pointer hover:bg-blue-500/40 transition-colors" style={{ height: `${height}%` }}>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs px-2 py-1 rounded">
                  {height}%
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-between mt-4 text-xs text-slate-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold w-full text-left mb-6">Department Performance</h3>
          <div className="w-full space-y-4">
            {/* Mock Horizontal Bars */}
            {[
              { label: 'Anatomy', val: 82 },
              { label: 'Physiology', val: 78 },
              { label: 'Biochemistry', val: 70 },
              { label: 'Pathology', val: 85 }
            ].map((dept, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{dept.label}</span>
                  <span className="text-slate-400">{dept.val}% Avg</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dept.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
