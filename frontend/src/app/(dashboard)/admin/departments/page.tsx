'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { ArrowUpDown, Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

type Department = {
  id: string;
  name: string;
  code: string;
  description: string;
  isClinical: boolean;
  hodId: string | null;
};

const columnHelper = createColumnHelper<Department>();

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => {
      return (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center space-x-1 font-semibold hover:text-white">
          <span>Name</span>
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
      );
    },
    cell: info => <span className="font-medium text-white">{info.getValue()}</span>,
  }),
  columnHelper.accessor('code', {
    header: 'Code',
    cell: info => (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: info => <span className="text-slate-400 line-clamp-1">{info.getValue()}</span>,
  }),
  columnHelper.accessor('isClinical', {
    header: 'Type',
    cell: info => (
      <span className="text-slate-300">
        {info.getValue() ? '🏥 Clinical' : '📚 Academic'}
      </span>
    ),
  }),
  columnHelper.accessor('hodId', {
    header: 'HOD',
    cell: info => (
      <span className={info.getValue() ? 'text-emerald-400' : 'text-slate-500'}>
        {info.getValue() ? 'Assigned' : 'Unassigned'}
      </span>
    ),
  }),
];

export default function ManageDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', isClinical: false });
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

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

  const table = useReactTable({
    data: departments,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Departments</h1>
          <p className="text-slate-400">Configure academic and clinical departments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors shadow-lg shadow-violet-500/20 font-medium"
        >
          + Add Department
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input 
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search departments..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full rounded-xl bg-slate-800" />
            <Skeleton className="h-10 w-full rounded-xl bg-slate-800" />
            <Skeleton className="h-10 w-full rounded-xl bg-slate-800" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center bg-slate-950/20">
          <span>Showing {table.getRowModel().rows.length} departments</span>
        </div>
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
              <div className="flex items-center space-x-2 mt-4">
                <input type="checkbox" id="isClinical" checked={formData.isClinical} onChange={e => setFormData({...formData, isClinical: e.target.checked})} className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-violet-500 focus:ring-violet-500" />
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
    </motion.div>
  );
}
