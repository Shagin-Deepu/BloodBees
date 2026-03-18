import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Droplet, Clock, Building2, Phone, CheckCircle, Loader, User, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const urgencyColors = {
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-500/20',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-500/20',
    low: 'bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 border border-lime-200/50 dark:border-lime-500/20',
};

const CoolOffRing = ({ lastDonationDate }) => {
    const [showExact, setShowExact] = useState(false);
    if (!lastDonationDate) return null;
    const lastDate = new Date(lastDonationDate);
    const diffMs = Date.now() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 90 - diffDays);
    if (daysRemaining === 0) return null;

    const hoursRemaining = Math.floor((90 * 24) - (diffMs / (1000 * 60 * 60)));
    const progress = ((90 - daysRemaining) / 90) * 100;

    return (
        <div title="Cool-off Period. Click to toggle exact time." className="relative w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer group ml-auto" onClick={() => setShowExact(!showExact)}>
            <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-orange-200 dark:text-orange-900/50" />
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="100" strokeDashoffset={100 - progress} className="text-orange-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-orange-700 dark:text-orange-400">
                {showExact ? `${hoursRemaining}h` : `${daysRemaining}d`}
            </div>
        </div>
    );
};

const FulfillmentTimer = ({ request, pledgeDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!pledgeDate || !request) return;

        const hours = request.urgency === 'critical' ? 2 : 24;
        const endTime = new Date(pledgeDate).getTime() + (hours * 60 * 60 * 1000);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('Expired');
            } else {
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${h}h ${m}m ${s}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [pledgeDate, request]);

    return (
        <div className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded border ${timeLeft === 'Expired' ? 'text-red-600 bg-red-50 border-red-100' : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30'}`}>
            <Clock className={`w-3 h-3 ${timeLeft !== 'Expired' ? 'animate-pulse' : ''}`} />
            {timeLeft === 'Expired' ? 'Time Expired' : `Window: ${timeLeft}`}
        </div>
    );
};

const Donate = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [requests, setRequests] = useState([]);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests');
    const [pledgeState, setPledgeState] = useState({});
    const [filters, setFilters] = useState({ location: '', blood_group: '', urgency: '' });

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchRequests();
        } else {
            fetchDonors();
        }
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== '')
            );
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests?${queryParams}`);
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== '' && v !== 'urgency')
            );
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/donors`);
            if (response.ok) {
                let data = await response.json();
                if (filters.location) data = data.filter(d => (d.location || '').toLowerCase().includes(filters.location.toLowerCase()));
                if (filters.blood_group) data = data.filter(d => d.blood_group === filters.blood_group);
                setDonors(data);
            }
        } catch (error) {
            console.error('Error fetching donors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePledge = async (requestId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setPledgeState(prev => ({ ...prev, [requestId]: 'loading' }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ donor_id: user.id, request_id: requestId })
            });
            const data = await response.json();
            if (response.ok) {
                setPledgeState(prev => ({ ...prev, [requestId]: 'done' }));
            } else {
                setPledgeState(prev => ({ ...prev, [requestId]: data.error || 'error' }));
            }
        } catch (error) {
            console.error('Error pledging donation:', error);
            setPledgeState(prev => ({ ...prev, [requestId]: 'error' }));
        }
    };

    const selectClass = "px-3 py-2 border border-gray-200/50 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Blood & Donate</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse active blood requests, or find potential donors in your area.</p>
            </div>

            <div className="flex space-x-2 border-b border-gray-200/50 dark:border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                    Blood Requests
                </button>
                <button
                    onClick={() => setActiveTab('donors')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'donors' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                    Donor Directory
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl p-4 rounded-2xl border border-gray-200/50 dark:border-white/5 flex flex-col md:flex-row gap-3 transition-colors duration-200">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        placeholder="Filter by city or location..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select name="blood_group" value={filters.blood_group} onChange={handleFilterChange} className={selectClass}>
                        <option value="">All Blood Types</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    {activeTab === 'requests' && (
                        <select name="urgency" value={filters.urgency} onChange={handleFilterChange} className={selectClass}>
                            <option value="">All Urgencies</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    )}
                    <button
                        onClick={activeTab === 'requests' ? fetchRequests : fetchDonors}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-gray-500 dark:text-gray-400">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{activeTab === 'requests' ? 'Loading requests...' : 'Loading donors...'}</span>
                </div>
            ) : activeTab === 'requests' ? (
                requests.length === 0 ? (
                    <div className="text-center py-20">
                        <Droplet className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No blood requests found.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {requests.map((request) => {
                            const state = pledgeState[request.id] || 'idle';
                            const isDone = state === 'done';
                            const isLoading = state === 'loading';
                            const isError = typeof state === 'string' && !['idle', 'loading', 'done'].includes(state);

                            return (
                                <div key={request.id} className="bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/5 p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-none dark:hover:border-white/10">
                                    {/* Top row */}
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">{request.patient_name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" /> {request.location}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                                                <Building2 className="w-3.5 h-3.5 shrink-0" /> {request.hospital_name}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${urgencyColors[request.urgency] || urgencyColors.medium}`}>
                                            {request.urgency?.charAt(0).toUpperCase() + request.urgency?.slice(1)}
                                        </span>
                                    </div>

                                    {/* Blood group */}
                                    <div className="flex items-center gap-2 bg-red-50/70 dark:bg-red-500/10 rounded-xl px-4 py-3 border border-red-100/50 dark:border-red-500/10">
                                        <Droplet className="w-5 h-5 text-red-600 dark:text-red-400 fill-current" />
                                        <span className="font-bold text-red-700 dark:text-red-300 text-sm">{request.blood_group} Blood Needed</span>
                                    </div>

                                    {/* Note */}
                                    {request.note && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">"{request.note}"</p>
                                    )}

                                    {/* Footer */}
                                    <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between items-center mt-auto gap-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                        </div>

                                        {isDone ? (
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 text-xs font-semibold">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Pledged!
                                                    {request.requester_phone && (
                                                        <a href={`tel:${request.requester_phone}`} className="flex items-center gap-1 ml-2 text-lime-600 dark:text-lime-400 underline">
                                                            <Phone className="w-3.5 h-3.5" /> {request.requester_phone}
                                                        </a>
                                                    )}
                                                </div>
                                                <FulfillmentTimer request={request} pledgeDate={new Date()} />
                                            </div>
                                        ) : isError ? (
                                            <span className="text-xs text-red-500 dark:text-red-400">{state}</span>
                                        ) : (
                                            <div className="relative group">
                                                <button
                                                    onClick={() => handlePledge(request.id)}
                                                    disabled={isLoading || (user && user.blood_group !== request.blood_group)}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    {isLoading ? (
                                                        <><Loader className="w-3.5 h-3.5 animate-spin" /> Pledging...</>
                                                    ) : (
                                                        <><Droplet className="w-3.5 h-3.5" /> Pledge to Donate</>
                                                    )}
                                                </button>
                                                {user && user.blood_group !== request.blood_group && (
                                                    <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg right-0 z-10 pointer-events-none">
                                                        Blood group mismatch.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                donors.length === 0 ? (
                    <div className="text-center py-20">
                        <User className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No donors found.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {donors.map((donor) => (
                            <div key={donor.id} className="bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/5 p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-none dark:hover:border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-lg font-bold shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm relative">
                                        {donor.name?.[0]?.toUpperCase() || 'U'}
                                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full ${donor.is_online ? 'bg-lime-500' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base text-gray-900 dark:text-white truncate flex items-center gap-2">
                                            {donor.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" /> {donor.location || 'Unknown Location'}
                                        </p>
                                    </div>
                                    <CoolOffRing lastDonationDate={donor.last_donation_date} />
                                </div>

                                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic flex items-start gap-2">
                                        <Activity className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        {donor.status_note ? `"${donor.status_note}"` : "No status set"}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 dark:border-white/5 pt-3 flex justify-between items-center mt-auto gap-3">
                                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-1.5 border border-red-100/50 dark:border-red-500/10">
                                        <Droplet className="w-4 h-4 text-red-600 dark:text-red-400 fill-current" />
                                        <span className="font-bold text-red-700 dark:text-red-300 text-xs">{donor.blood_group || 'O+'}</span>
                                    </div>

                                    <a href={`tel:${donor.phone}`} className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white text-xs font-semibold rounded-lg transition-colors">
                                        <Phone className="w-3.5 h-3.5" /> Contact
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Donate;
