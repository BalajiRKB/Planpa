'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getStoredUser } from '@/src/hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setName(storedUser.name);
      setEmail(storedUser.email);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Implement API call to update profile
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement API call to change password
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#85ABB0] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border-2 border-black ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Information Card */}
          <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-8 border-2 border-black mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white disabled:bg-gray-100 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to original values
                      const storedUser = getStoredUser();
                      if (storedUser) {
                        setName(storedUser.name);
                        setEmail(storedUser.email);
                      }
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-8 border-2 border-black mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Account Stats Card */}
          <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-8 border-2 border-black">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Statistics</h2>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#85ABB0] rounded-xl p-4 border-2 border-black text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-700">Tasks Completed</div>
              </div>
              <div className="bg-[#85ABB0] rounded-xl p-4 border-2 border-black text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-700">Schedules Created</div>
              </div>
              <div className="bg-[#85ABB0] rounded-xl p-4 border-2 border-black text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-700">Hours Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
