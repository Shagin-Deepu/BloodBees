import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const RequestBlood = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        patient_name: '',
        blood_group: '',
        hospital_name: '',
        location: '',
        date_of_requirement: '',
        bystander_name: '',
        bystander_contact: '',
        urgency: 'medium',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            alert('Please login to submit a request');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, requester_id: user.id })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Blood request submitted successfully!');
                navigate('/donate'); // Redirect to blood requests board
            } else {
                alert(data.error || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 transition-colors duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Left Column Content */}
                <div className="max-w-xl">
                    <h1 className="text-4xl lg:text-[2.75rem] leading-[1.1] font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                        Request Blood.<br />
                        <span className="text-red-600">Save a life today.</span>
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
                        We automatically filter the data and link your request to the right donors in your vicinity—so your request stays accurate, current, and ready to act on.
                    </p>

                    <div className="space-y-5 pl-6 border-l-[3px] border-lime-400/60 dark:border-lime-400/40 mb-12">
                        <div className="flex items-center gap-2 text-[1.1rem] font-medium text-gray-800 dark:text-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0"></span>
                            Build a rock-solid communication flow
                        </div>
                        <div className="flex items-center gap-2 text-[1.1rem] font-medium text-gray-800 dark:text-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0"></span>
                            Donor matching, fully automated
                        </div>
                        <div className="flex items-center gap-2 text-[1.1rem] font-medium text-gray-800 dark:text-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0"></span>
                            Stay ahead of emergency situations
                        </div>
                    </div>

                    <Link to="/donate" className="inline-flex items-center gap-2 text-[1.05rem] font-medium text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition-colors group">
                        Learn more
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Right Column Form */}
                <div className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-200/50 dark:border-white/5 relative transition-colors duration-200">
                    <div className="flex items-start gap-3 mb-8 bg-blue-50/50 dark:bg-black/20 p-4 rounded-xl text-slate-700 dark:text-slate-300 border border-blue-100/50 dark:border-white/5">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-slate-500" />
                        <p className="text-sm font-medium leading-relaxed">Please provide accurate information. This request will be broadcast to nearby donors immediately.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Patient Name</label>
                                <input
                                    type="text"
                                    name="patient_name"
                                    required
                                    value={formData.patient_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Blood Type Required</label>
                                <div className="relative">
                                    <select
                                        name="blood_group"
                                        required
                                        value={formData.blood_group}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none appearance-none"
                                    >
                                        <option value="" className="bg-white dark:bg-[#1a1a1a]">Select Type</option>
                                        <option value="A+" className="bg-white dark:bg-[#1a1a1a]">A+</option>
                                        <option value="A-" className="bg-white dark:bg-[#1a1a1a]">A-</option>
                                        <option value="B+" className="bg-white dark:bg-[#1a1a1a]">B+</option>
                                        <option value="B-" className="bg-white dark:bg-[#1a1a1a]">B-</option>
                                        <option value="O+" className="bg-white dark:bg-[#1a1a1a]">O+</option>
                                        <option value="O-" className="bg-white dark:bg-[#1a1a1a]">O-</option>
                                        <option value="AB+" className="bg-white dark:bg-[#1a1a1a]">AB+</option>
                                        <option value="AB-" className="bg-white dark:bg-[#1a1a1a]">AB-</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Hospital Name</label>
                                <input
                                    type="text"
                                    name="hospital_name"
                                    required
                                    value={formData.hospital_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="Hospital Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">City / Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Date of Requirement</label>
                                <input
                                    type="date"
                                    name="date_of_requirement"
                                    required
                                    value={formData.date_of_requirement}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Bystander Name</label>
                                <input
                                    type="text"
                                    name="bystander_name"
                                    required
                                    value={formData.bystander_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="Contact Person's Name"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Bystander Contact No.</label>
                                <input
                                    type="tel"
                                    name="bystander_contact"
                                    required
                                    value={formData.bystander_contact}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Urgency Level</label>
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value="critical"
                                            checked={formData.urgency === 'critical'}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-500 peer-checked:border-white peer-checked:bg-white transition-colors bg-white dark:bg-transparent"></div>
                                        <div className="absolute w-[8px] h-[8px] rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Critical (Within 24hrs)</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value="medium"
                                            checked={formData.urgency === 'medium'}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-500 peer-checked:border-red-600 peer-checked:bg-transparent transition-colors bg-white dark:bg-transparent"></div>
                                        <div className="absolute w-[8px] h-[8px] rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-sm font-medium text-red-600 dark:text-red-500 transition-colors">Standard</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value="low"
                                            checked={formData.urgency === 'low'}
                                            onChange={handleChange}
                                            className="peer sr-only"
                                        />
                                        <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-500 peer-checked:border-white peer-checked:bg-transparent transition-colors bg-white dark:bg-transparent"></div>
                                        <div className="absolute w-[8px] h-[8px] rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Low</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Additional Note</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/20 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-y"
                                rows="3"
                                placeholder="Any specific requirements..."
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#E02424] hover:bg-[#C81E1E] text-white font-bold rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestBlood;
