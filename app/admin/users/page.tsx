'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react';

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'admin',
    club_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, []);

  async function fetchUsers() {
    const res = await fetch('/api/admin/users');
    const d = await res.json();
    if (d.success) setUsers(d.data);
    else if (d.error === 'Forbidden') {
      toast.error('You do not have permission to view users.');
    }
    setLoading(false);
    
    // Check if current user is Dev User (2400030188)
    fetch('/api/admin/setup') // Just a trick to get session, or we can look at a global state
      .then(r => r.json())
      .catch(() => {});
  }
  
  // Checking session the right way for dev check
  useEffect(() => {
    // If the dev tools link is visible in sidebar, this user is dev.
    // We can also just safely try the PATCH request. If it fails, they aren't dev.
    // But for UI, let's allow anyone to click it and the backend will reject if not Dev.
    setIsDev(true); // Let backend enforce it to keep it simple.
  }, []);

  async function fetchClubs() {
    const res = await fetch('/api/admin/clubs');
    const d = await res.json();
    if (d.success) setClubs(d.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    if (form.role === 'club_lead' && !form.club_name) {
      toast.error('Please select a club for the Club Lead');
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      club_name: form.role === 'club_lead' ? form.club_name : null,
    };

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const d = await res.json();
    if (d.success) {
      toast.success('User created!');
      setShowForm(false);
      setForm({ name: '', username: '', password: '', role: 'admin', club_name: '' });
      fetchUsers();
    } else {
      toast.error(d.error);
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success('User deleted');
      setUsers(users.filter(u => u.id !== id));
    } else {
      toast.error(d.error);
    }
  }

  async function resetPassword(id: number) {
    if (!confirm('Reset this user\'s password to "sac@321"?')) return;
    
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      body: JSON.stringify({ id, password: 'sac@321' }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success('Password reset to sac@321');
    } else {
      toast.error(d.error || 'Only the Developer user can do this.');
    }
  }

  if (loading) return <div className="p-10 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#191313]">Users</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-[#970003] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-800 transition">
          <Plus size={18} /> Add User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border hairline space-y-4">
          <h2 className="font-bold text-lg">Create New User</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Username</label>
              <input required type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" placeholder="johndoe123" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white">
                <option value="admin">Admin (Full Access)</option>
                <option value="club_lead">Club Lead (Restricted)</option>
              </select>
            </div>

            {form.role === 'club_lead' && (
              <div>
                <label className="block text-sm font-semibold mb-1">Assign Club</label>
                <select required value={form.club_name} onChange={e => setForm({ ...form, club_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white">
                  <option value="">Select a club...</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1">Password</label>
              <div className="relative">
                <input required type={showPassword ? 'text' : 'password'} value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg" placeholder="Password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 font-semibold text-gray-500">Cancel</button>
            <button type="submit" disabled={saving} className="bg-[#970003] text-white px-5 py-2 rounded-lg font-semibold">
              {saving ? 'Saving...' : 'Create User'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border hairline overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b hairline">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Username</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Role</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Assigned Club</th>
              <th className="px-6 py-3 font-semibold text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hairline last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4 text-gray-500">{u.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'Club Lead'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{u.club_name || '—'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => resetPassword(u.id)} title="Dev Only: Reset Password to sac@321"
                    className="p-1.5 text-orange-500 hover:bg-orange-50 rounded transition">
                    <ShieldAlert size={16} />
                  </button>
                  <button onClick={() => handleDelete(u.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found.</div>}
      </div>
    </div>
  );
}
