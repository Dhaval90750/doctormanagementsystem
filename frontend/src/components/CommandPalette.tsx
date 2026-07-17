'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <Command label="Global Command Menu" className="w-full text-slate-100">
          <Command.Input 
            placeholder="Type a command or search..." 
            className="w-full px-4 py-4 bg-transparent border-b border-slate-800 text-lg outline-none placeholder:text-slate-500" 
            autoFocus
          />
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-slate-500">No results found.</Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-semibold text-slate-400">
              <Command.Item 
                onSelect={() => { setOpen(false); router.push('/dashboard'); }}
                className="px-4 py-2 mt-1 rounded-lg cursor-pointer hover:bg-violet-600 hover:text-white aria-selected:bg-violet-600 aria-selected:text-white transition-colors"
              >
                Dashboard Home
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); router.push('/admin/users'); }}
                className="px-4 py-2 mt-1 rounded-lg cursor-pointer hover:bg-violet-600 hover:text-white aria-selected:bg-violet-600 aria-selected:text-white transition-colors"
              >
                Manage Users
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); router.push('/admin/departments'); }}
                className="px-4 py-2 mt-1 rounded-lg cursor-pointer hover:bg-violet-600 hover:text-white aria-selected:bg-violet-600 aria-selected:text-white transition-colors"
              >
                Manage Departments
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); router.push('/attendance'); }}
                className="px-4 py-2 mt-1 rounded-lg cursor-pointer hover:bg-violet-600 hover:text-white aria-selected:bg-violet-600 aria-selected:text-white transition-colors"
              >
                Take Attendance
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
