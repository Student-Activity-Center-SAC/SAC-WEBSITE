'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, Save } from 'lucide-react';

export default function SettingsAdminPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setSaving(true);
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    
    const d = await res.json();
    if (d.success) {
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(d.error || 'Failed to update password');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 text-red-800 rounded-lg">
          <KeyRound size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#191313]">Account Settings</h1>
          <p className="text-gray-500 text-sm">Update your password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border hairline space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Current Password</label>
          <div className="relative">
            <input required type={showCurrent ? 'text' : 'password'} value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg" placeholder="Enter current password" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="pt-2 border-t hairline"></div>

        <div>
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <div className="relative">
            <input required type={showNew ? 'text' : 'password'} value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg" placeholder="Enter new password" />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
          <input required type="password" value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg" placeholder="Confirm new password" />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="bg-[#970003] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2">
            <Save size={18} /> {saving ? 'Saving...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
