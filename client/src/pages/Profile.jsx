import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Users, MapPin, Phone, Mail, Calendar, Activity, Droplet, Loader2, AlertCircle, LogIn, Save, Trash2, Edit3, Key, Camera, X, Info } from 'lucide-react';

const Profile = () => {
    const localUser = JSON.parse(localStorage.getItem('user'));

    // Admin Redirect Fallback
    if (localUser?.role === 'admin') {
        return <Navigate to="/godmode" replace />;
    }

    const userId = localUser?.id;

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('donations');
    const [statusNote, setStatusNote] = useState('');
    const [isOnline, setIsOnline] = useState(true);
    const [isSavingStatus, setIsSavingStatus] = useState(false);

    // Cool-off Timer State
    const [showExactTime, setShowExactTime] = useState(false);

    // Editing State
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editForm, setEditForm] = useState({ phone: '', location: '', blood_group: '' });
    const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    useEffect(() => {
        if (!userId) {
            setError('No user session found. Please log in.');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                const data = await response.json();
                setProfileData(data);
                setStatusNote(data.user.status_note || '');
                setIsOnline(data.user.is_online !== 0);
                setEditForm({
                    phone: data.user.phone || '',
                    location: data.user.location || '',
                    blood_group: data.user.blood_group || ''
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Could not load profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleToggleOnline = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus); // Optimistic update

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_note: statusNote, is_online: newStatus ? 1 : 0, is_profile_visible: newStatus ? 1 : 0 })
            });
            if (!response.ok) {
                setIsOnline(!newStatus); // Revert
                alert('Failed to update status visibility');
            }
        } catch (error) {
            console.error('Error updating visibility status:', error);
            setIsOnline(!newStatus); // Revert
            alert('An error occurred while updating visibility status');
        }
    };

    const handleStatusUpdate = async () => {
        setIsSavingStatus(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_note: statusNote, is_online: isOnline ? 1 : 0, is_profile_visible: isOnline ? 1 : 0 })
            });
            if (response.ok) {
                alert('Status note updated successfully!');
            } else {
                alert('Failed to update status note');
            }
        } catch (error) {
            console.error('Error updating status note:', error);
            alert('An error occurred while updating status note');
        } finally {
            setIsSavingStatus(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.")) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Account deleted successfully.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/register';
            } else {
                alert('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting account');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return alert("Image too large. Max 2MB.");

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/avatar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile_picture: base64String })
                });
                if (res.ok) {
                    setProfileData(prev => ({ ...prev, user: { ...prev.user, profile_picture: base64String } }));
                    const updatedLocal = { ...localUser, profile_picture: base64String };
                    localStorage.setItem('user', JSON.stringify(updatedLocal));
                } else alert("Failed to update avatar.");
            } catch (e) { console.error(e); }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                setProfileData(prev => ({ ...prev, user: { ...prev.user, ...editForm } }));
                setShowEditModal(false);
                alert("Profile Information Updated!");
            } else alert("Failed to update profile.");
        } catch (e) { console.error(e); }
        finally { setIsSavingProfile(false); }
    };

    const handleProofUpload = async (e, donationId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('certificate', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donations/${donationId}/upload-proof`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                // Update local status so UI reflects completion immediately
                setProfileData(prev => ({
                    ...prev,
                    history: prev.history.map(item =>
                        item.id === donationId ? { ...item, status: 'completed' } : item
                    )
                }));
                alert(data.message || "Proof uploaded! Donation marked as completed.");
            } else {
                alert(data.error || "Failed to upload proof.");
            }
        } catch (error) {
            console.error("Error uploading proof:", error);
            alert("An error occurred during upload.");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsSavingPassword(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passForm)
            });
            if (res.ok) {
                setShowPasswordModal(false);
                setPassForm({ oldPassword: '', newPassword: '' });
                alert("Password Updated Successfully!");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update password.");
            }
        } catch (e) { console.error(e); }
        finally { setIsSavingPassword(false); }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
                <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">Session Not Found</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Please log in to view your profile.</p>
                </div>
                <Link
                    to="/login"
                    className="flex items-center gap-2 mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                    <LogIn className="w-4 h-4" />
                    Log In
                </Link>
            </div>
        );
    }

    const { user, stats, history } = profileData;

    const statCards = [
        { label: 'Total Donations', value: stats.totalDonations, icon: Droplet, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        { label: 'Lives Saved', value: stats.livesSaved, icon: Activity, color: 'text-lime-500', bg: 'bg-lime-50 dark:bg-lime-900/20' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    ];

    const getStatusBadge = (status) => {
        const map = {
            completed: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
            scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
            cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
        };
        return map[status] || map.cancelled;
    };

    const renderCoolOffTimer = () => {
        if (!user.last_donation_date) return null;
        const lastDate = new Date(user.last_donation_date);
        const diffMs = Date.now() - lastDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 90 - diffDays);
        if (daysRemaining === 0) return null; // Cool-off finished

        const hoursRemaining = Math.floor((90 * 24) - (diffMs / (1000 * 60 * 60)));
        const progress = ((90 - daysRemaining) / 90) * 100;

        return (
            <div className="flex items-center gap-4 mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                <div title="Click to toggle days/hours" className="relative w-16 h-16 flex items-center justify-center shrink-0 cursor-pointer group" onClick={() => setShowExactTime(!showExactTime)}>
                    <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-orange-200 dark:text-orange-900/50" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * progress) / 100} className="text-orange-500 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-400">
                        {showExactTime ? `${hoursRemaining}h` : `${daysRemaining}d`}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-orange-800 dark:text-orange-300">Cool-off Period</h4>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">You must wait {daysRemaining} more days before your next donation.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and donation history</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-white/5 p-6 flex items-center transition-colors duration-200">
                        <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-white/5 text-center transition-colors duration-200">
                        <div className="relative inline-block group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
                            {user.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-700 shadow-md object-cover mx-auto" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-4xl font-bold mb-4 mx-auto ring-4 ring-white dark:ring-gray-700 shadow-md">
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 flex items-center gap-1 rounded-full"><Camera className="w-3 h-3" />Edit</span>
                            </div>
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <div className={`absolute bottom-2 right-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 z-10`}></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm capitalize mb-4">{user.role || 'Donor'}</p>
                        <div className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full font-bold text-sm">
                            <Droplet className="w-4 h-4 mr-2" />
                            Blood Group: {user.blood_group || 'N/A'}
                        </div>
                        {renderCoolOffTimer()}
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-white/5 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">Contact Information</h3>
                            <button onClick={() => setShowEditModal(true)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <Mail className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <span className="text-sm truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <Phone className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <span className="text-sm">{user.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <MapPin className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <span className="text-sm">{user.location || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <Calendar className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <span className="text-sm">Joined {user.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-white/5 transition-colors duration-200">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Availability Status</h3>

                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Donor status</span>
                                <div className="group relative flex items-center">
                                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-gray-900 text-white text-xs text-center p-2 rounded-lg shadow-lg z-10 pointer-events-none">
                                        When active, your profile is visible in the Donor Directory.
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleOnline}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a1a] ${isOnline ? 'bg-lime-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Status Note (Shown to others)</label>
                            <input
                                type="text"
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                placeholder="e.g. Available this weekend"
                                maxLength={100}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-colors"
                            />
                            <button
                                onClick={handleStatusUpdate}
                                disabled={isSavingStatus}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
                            >
                                {isSavingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Status
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 font-medium rounded-lg transition-colors text-sm"
                            >
                                <Key className="w-4 h-4" />
                                Change Password
                            </button>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900/30 transition-colors duration-200">
                        <h3 className="font-bold text-red-800 dark:text-red-400 mb-2">Danger Zone</h3>
                        <p className="text-xs text-red-600 dark:text-red-300 mb-4 opacity-80">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-colors text-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Right Column - Donation History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-white/5 overflow-hidden transition-colors duration-200">
                        <div className="border-b border-gray-100 dark:border-white/5">
                            <div className="flex overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('donations')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'donations' ? 'text-red-600 border-red-600 dark:text-red-400 dark:border-red-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Donation History
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {history && history.length > 0 ? (
                                <div className="space-y-4">
                                    {history.map((item) => (
                                        <div key={item.id} className="flex flex-col p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 transition-colors duration-200">
                                            <div className="flex items-start">
                                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 flex-shrink-0">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                                                Blood Donation — {item.hospital_name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {item.blood_group} • {item.location}
                                                            </p>
                                                        </div>
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadge(item.status)}`}>
                                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 flex items-center text-xs text-gray-400 dark:text-gray-500">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        <span>{new Date(item.donation_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {item.status === 'scheduled' && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Complete Your Donation</p>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => document.getElementById(`cert-upload-${item.id}`).click()}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg font-medium text-xs transition-colors"
                                                        >
                                                            <Activity className="w-4 h-4" /> Upload Certificate File
                                                        </button>
                                                        <button
                                                            onClick={() => document.getElementById(`photo-upload-${item.id}`).click()}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-lg font-medium text-xs transition-colors"
                                                        >
                                                            <Camera className="w-4 h-4" /> Take Photo
                                                        </button>
                                                        <input
                                                            type="file"
                                                            id={`cert-upload-${item.id}`}
                                                            className="hidden"
                                                            accept=".pdf,.png,.jpg,.jpeg"
                                                            onChange={(e) => handleProofUpload(e, item.id)}
                                                        />
                                                        <input
                                                            type="file"
                                                            id={`photo-upload-${item.id}`}
                                                            className="hidden"
                                                            accept="image/*"
                                                            capture="environment"
                                                            onChange={(e) => handleProofUpload(e, item.id)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Droplet className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No donation history yet</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        Your donations will appear here after you pledge to help someone.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <input required type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location/City</label>
                                <input required type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                                <select value={editForm.blood_group} onChange={e => setEditForm({ ...editForm, blood_group: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-gray-900 dark:text-white">
                                    <option value="">Select Option</option>
                                    <option value="A+">A+</option><option value="A-">A-</option>
                                    <option value="B+">B+</option><option value="B-">B-</option>
                                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    <option value="O+">O+</option><option value="O-">O-</option>
                                </select>
                            </div>
                            <button disabled={isSavingProfile} type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-colors mt-2 flex justify-center items-center">
                                {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPasswordModal(false)}>
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input required type="password" value={passForm.oldPassword} onChange={e => setPassForm({ ...passForm, oldPassword: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input required type="password" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 text-gray-900 dark:text-white" minLength="6" />
                            </div>
                            <button disabled={isSavingPassword} type="submit" className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 font-bold transition-colors mt-2 flex justify-center items-center">
                                {isSavingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
