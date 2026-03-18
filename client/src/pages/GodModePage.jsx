import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, Activity, Droplet, Loader2, AlertCircle,
    Phone, MapPin, Mail, Calendar, User, Trash2, X
} from 'lucide-react';

/* ─── tiny shared helpers ─── */
const Th = ({ children }) => (
    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {children}
    </th>
);

const Td = ({ children, mono, strong, muted }) => (
    <td className={`py-4 px-4 text-sm whitespace-nowrap
        ${mono ? 'font-mono' : ''}
        ${strong ? 'font-semibold text-gray-900 dark:text-white' : ''}
        ${muted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}
    `}>
        {children ?? <span className="text-gray-300 dark:text-gray-600">—</span>}
    </td>
);

const Badge = ({ children, variant = 'gray' }) => {
    const map = {
        gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        lime: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
        amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    };
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${map[variant]}`}>
            {children}
        </span>
    );
};

const EmptyState = ({ icon: Icon, label }) => (
    <div className="text-center py-16 select-none">
        <Icon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    </div>
);

const fmt = (date) =>
    date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

/* ─── status → badge variant ─── */
const statusVariant = (s) => {
    const m = { fulfilled: 'lime', completed: 'lime', pending: 'amber', scheduled: 'blue', cancelled: 'gray' };
    return m[s] || 'gray';
};

/* ═══════════════════════════ PAGE ═══════════════════════════ */
const GodModePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('users');

    // For Profile Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/'); return; }

        (async () => {
            try {
                const [uRes, rRes, dRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/admin/users`),
                    fetch(`${import.meta.env.VITE_API_URL}/admin/requests`),
                    fetch(`${import.meta.env.VITE_API_URL}/admin/donations`),
                ]);
                if (!uRes.ok || !rRes.ok || !dRes.ok) throw new Error('API error');
                setUsers(await uRes.json());
                setRequests(await rRes.json());
                setDonations(await dRes.json());
            } catch {
                setError('Could not load system data. Is the backend running?');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDeleteUser = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to completely delete this user? This will also remove their pledges and requests. THIS CANNOT BE UNDONE.")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting user.");
        }
    };

    const handleViewProfile = async (u) => {
        setSelectedUser(u);
        setLoadingProfile(true);
        setProfileData(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${u.id}/profile`);
            if (res.ok) {
                setProfileData(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const tabs = [
        { key: 'users', label: 'Users', icon: Users, count: users.length },
        { key: 'requests', label: 'Blood Requests', icon: Activity, count: requests.length },
        { key: 'donations', label: 'Donations', icon: Droplet, count: donations.length },
    ];

    const stats = [
        {
            label: 'Registered Users', value: users.length,
            icon: Users, colorIcon: 'text-blue-600 dark:text-blue-400', colorBg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Blood Requests', value: requests.length,
            icon: Activity, colorIcon: 'text-red-600 dark:text-red-400', colorBg: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            label: 'Donation Pledges', value: donations.length,
            icon: Droplet, colorIcon: 'text-lime-600 dark:text-lime-400', colorBg: 'bg-lime-50 dark:bg-lime-900/20'
        },
    ];

    /* ── loading / error ── */
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading system data…</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
            <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Load Failed</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
    );

    /* ── render ── */
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">God Mode</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Complete system oversight — live data from database
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-white/5 p-6 flex items-center transition-colors duration-200">
                        <div className={`p-3 rounded-lg ${s.colorBg} mr-4 flex-shrink-0`}>
                            <s.icon className={`w-6 h-6 ${s.colorIcon}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabbed Panel */}
            <div className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-white/5 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-100 dark:border-white/5">
                    <div className="flex overflow-x-auto">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === t.key
                                    ? 'text-red-600 border-red-600 dark:text-red-400 dark:border-red-400'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <t.icon className="w-4 h-4" />
                                {t.label}
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${activeTab === t.key
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                    }`}>{t.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table area */}
                <div className="overflow-x-auto custom-scrollbar">

                    {/* ── Users ── */}
                    {activeTab === 'users' && (
                        users.length === 0 ? <EmptyState icon={Users} label="No users registered yet." /> :
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                        <Th>#</Th>
                                        <Th>Name</Th>
                                        <Th>Email</Th>
                                        <Th>Phone</Th>
                                        <Th>Location</Th>
                                        <Th>Blood Grp</Th>
                                        <Th>Role</Th>
                                        <Th>Joined</Th>
                                        <Th>Actions</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} onClick={() => handleViewProfile(u)} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors last:border-0 cursor-pointer">
                                            <Td mono muted>#{u.id}</Td>
                                            <Td strong>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400 flex-shrink-0">
                                                        {u.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    {u.name}
                                                </div>
                                            </Td>
                                            <Td>
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    {u.email}
                                                </div>
                                            </Td>
                                            <Td>
                                                {u.phone
                                                    ? <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{u.phone}</div>
                                                    : null}
                                            </Td>
                                            <Td>
                                                {u.location
                                                    ? <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{u.location}</div>
                                                    : null}
                                            </Td>
                                            <Td>
                                                {u.blood_group
                                                    ? <span className="font-bold text-red-600 dark:text-red-400">{u.blood_group}</span>
                                                    : null}
                                            </Td>
                                            <Td>
                                                <Badge variant={u.role === 'admin' ? 'indigo' : 'gray'}>{u.role || 'user'}</Badge>
                                            </Td>
                                            <Td muted>
                                                {u.created_at
                                                    ? <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 flex-shrink-0" />{fmt(u.created_at)}</div>
                                                    : null}
                                            </Td>
                                            <Td>
                                                <button onClick={(e) => handleDeleteUser(u.id, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    )}

                    {/* ── Blood Requests ── */}
                    {activeTab === 'requests' && (
                        requests.length === 0 ? <EmptyState icon={Activity} label="No blood requests found." /> :
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                        <Th>#</Th>
                                        <Th>Patient</Th>
                                        <Th>Blood Grp</Th>
                                        <Th>Hospital</Th>
                                        <Th>Location</Th>
                                        <Th>Urgency</Th>
                                        <Th>Date Needed</Th>
                                        <Th>Bystander</Th>
                                        <Th>Contact</Th>
                                        <Th>Requested By</Th>
                                        <Th>Status</Th>
                                        <Th>Posted</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(r => (
                                        <tr key={r.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors last:border-0">
                                            <Td mono muted>#{r.id}</Td>
                                            <Td strong>{r.patient_name}</Td>
                                            <Td><span className="font-bold text-red-600 dark:text-red-400">{r.blood_group}</span></Td>
                                            <Td>{r.hospital_name}</Td>
                                            <Td>
                                                {r.location
                                                    ? <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{r.location}</div>
                                                    : null}
                                            </Td>
                                            <Td>
                                                <Badge variant={r.urgency === 'high' ? 'red' : r.urgency === 'medium' ? 'amber' : 'gray'}>
                                                    {r.urgency}
                                                </Badge>
                                            </Td>
                                            <Td muted>
                                                {r.date_of_requirement
                                                    ? <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 flex-shrink-0" />{fmt(r.date_of_requirement)}</div>
                                                    : null}
                                            </Td>
                                            <Td>{r.bystander_name}</Td>
                                            <Td>
                                                {r.bystander_contact
                                                    ? <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{r.bystander_contact}</div>
                                                    : null}
                                            </Td>
                                            <Td>
                                                {r.requester_name
                                                    ? <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{r.requester_name}</div>
                                                    : <span className="font-mono text-gray-400">User #{r.requester_id}</span>}
                                            </Td>
                                            <Td>
                                                <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                                            </Td>
                                            <Td muted>
                                                {r.created_at
                                                    ? <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 flex-shrink-0" />{fmt(r.created_at)}</div>
                                                    : null}
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    )}

                    {/* ── Donations ── */}
                    {activeTab === 'donations' && (
                        donations.length === 0 ? <EmptyState icon={Droplet} label="No donation pledges yet." /> :
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                        <Th>#</Th>
                                        <Th>Donor</Th>
                                        <Th>Patient</Th>
                                        <Th>Blood Group</Th>
                                        <Th>Hospital</Th>
                                        <Th>Location</Th>
                                        <Th>Status</Th>
                                        <Th>Pledge Date</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map(d => (
                                        <tr key={d.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors last:border-0">
                                            <Td mono muted>#{d.id}</Td>
                                            <Td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400 flex-shrink-0">
                                                        {d.donor_name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {d.donor_name || `User #${d.donor_id}`}
                                                    </span>
                                                </div>
                                            </Td>
                                            <Td strong>{d.patient_name || `Req #${d.request_id}`}</Td>
                                            <Td>
                                                {d.blood_group
                                                    ? <span className="font-bold text-red-600 dark:text-red-400">{d.blood_group}</span>
                                                    : null}
                                            </Td>
                                            <Td>{d.hospital_name}</Td>
                                            <Td>
                                                {d.location
                                                    ? <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{d.location}</div>
                                                    : null}
                                            </Td>
                                            <Td>
                                                <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                                            </Td>
                                            <Td muted>
                                                {d.donation_date
                                                    ? <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 flex-shrink-0" />{fmt(d.donation_date)}</div>
                                                    : null}
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    )}

                </div>
            </div>

            {/* Profile Overview Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white rounded-full transition-colors z-10">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/10">
                                <div className="relative inline-block">
                                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-2xl font-bold flex-shrink-0 ring-4 ring-white dark:ring-[#1a1a1a] shadow-sm">
                                        {selectedUser.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-[#1a1a1a] rounded-full ${selectedUser.is_online ? 'bg-lime-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {selectedUser.name} <Badge variant={selectedUser.role === 'admin' ? 'indigo' : 'gray'}>{selectedUser.role}</Badge>
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{selectedUser.email}</p>
                                </div>
                            </div>

                            {/* Body */}
                            {loadingProfile ? (
                                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
                            ) : profileData ? (
                                <div className="space-y-6">
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 text-center border border-blue-100 dark:border-blue-900/30">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Blood</p>
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedUser.blood_group || 'N/A'}</p>
                                        </div>
                                        <div className="bg-lime-50 dark:bg-lime-900/10 rounded-xl p-3 text-center border border-lime-100 dark:border-lime-900/30">
                                            <p className="text-xs text-lime-600 dark:text-lime-400 font-medium mb-1">Donations</p>
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{profileData.stats.totalDonations}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-3 text-center border border-red-100 dark:border-red-900/30">
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Reqs</p>
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{profileData.stats.pendingRequests}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3">
                                        {(selectedUser.phone || selectedUser.location) && <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact & Location</h3>}
                                        {selectedUser.phone && (
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-3">
                                                <Phone className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                                                {selectedUser.phone}
                                            </div>
                                        )}
                                        {selectedUser.location && (
                                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-3">
                                                <MapPin className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                                                {selectedUser.location}
                                            </div>
                                        )}

                                        {profileData.user.status_note && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status Note</h3>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 italic px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-lg border-l-2 border-red-500">
                                                    "{profileData.user.status_note}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="pt-4 mt-6 flex gap-3">
                                        <button onClick={(e) => { setSelectedUser(null); handleDeleteUser(selectedUser.id, e); }} className="w-full px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 font-medium rounded-lg transition-colors flex items-center justify-center text-sm gap-2">
                                            <Trash2 className="w-4 h-4" />
                                            Delete User
                                        </button>
                                        <button onClick={() => setSelectedUser(null)} className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 font-medium rounded-lg transition-colors text-sm">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 text-gray-500">Could not load profile.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GodModePage;
