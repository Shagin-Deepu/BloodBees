import React, { useState, useEffect } from 'react';
import { Heart, Shield, Users, Activity, Zap, Globe, ChevronRight } from 'lucide-react';

const About = () => {
    const [stats, setStats] = useState({ donors: 0, livesSaved: 0, requests: 0 });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/stats`)
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(err => console.error('Failed to load stats:', err));
    }, []);
    const teamMembers = [
        {
            name: 'Shagin Deepu',
            role: 'Developer ',
            image: `https://ui-avatars.com/api/?name=Shagin+Deepu&background=dc2626&color=fff&size=256`,
            bio: 'Driving the vision and technical architecture to connect donors securely.',
            initials: 'SD',
        },
        {
            name: 'Sanjay Santhosh',
            role: 'Developer',
            image: `https://ui-avatars.com/api/?name=Sanjay+Santhosh&background=1D4ED8&color=fff&size=256`,
            bio: 'Ensuring seamless operations and optimizing matching algorithms.',
            initials: 'SS',
        },
        {
            name: 'Sreejith',
            role: 'Developer',
            image: `https://ui-avatars.com/api/?name=Sreejith&background=B91C1C&color=fff&size=256`,
            bio: 'Building robust backend systems and database structures.',
            initials: 'SR',
        },
        {
            name: 'Rinu Fathima',
            role: 'Developer',
            image: `https://ui-avatars.com/api/?name=Rinu+Fathima&background=047857&color=fff&size=256`,
            bio: 'Crafting intuitive user interfaces for an optimal donor experience.',
            initials: 'RF',
        }
    ];

    const values = [
        {
            icon: Heart,
            title: 'Empathy First',
            description: 'We understand the urgency and emotional weight of every blood request.',
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-500/10',
        },
        {
            icon: Shield,
            title: 'Verified & Secure',
            description: 'Every request is vetted to ensure authenticity and donor safety.',
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
        },
        {
            icon: Users,
            title: 'Community Driven',
            description: 'Powered by the selfless acts of everyday heroes in our neighborhoods.',
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-500/10',
        },
        {
            icon: Zap,
            title: 'Rapid Response',
            description: 'Optimized technology to match donors with patients in record time.',
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
        },
        {
            icon: Globe,
            title: 'Wide Reach',
            description: 'Connecting donors and recipients across cities and communities.',
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-500/10',
        },
        {
            icon: Activity,
            title: 'Real-time Matching',
            description: 'Instant blood request notifications sent to matching donors nearby.',
            color: 'text-cyan-500',
            bg: 'bg-cyan-50 dark:bg-cyan-500/10',
        },
    ];

    return (
        <div className="font-sans min-h-full pb-16 space-y-20 transition-colors duration-200">

            {/* Hero Section */}
            <div className="relative pt-10 lg:pt-16 text-center">
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs uppercase tracking-widest mb-6">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    Our Story
                </div>

                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 max-w-3xl mx-auto leading-tight px-4">
                    Bridging the gap to{' '}
                    <span className="text-red-600 dark:text-red-500">Save Lives</span>
                </h1>

                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                    We built this platform on a simple principle: no one should have to struggle to find life-saving blood.
                    We connect willing donors directly with patients critically awaiting their help.
                </p>

                {/* Stats Row */}
                <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto px-4">
                    {[
                        { value: stats.donors.toLocaleString(), label: 'Registered Donors' },
                        { value: stats.livesSaved.toLocaleString(), label: 'Lives Saved', highlight: true },
                        { value: stats.requests.toLocaleString(), label: 'Blood Requests' },
                    ].map((s, i) => (
                        <div key={i} className={`bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-4 border ${s.highlight ? 'border-lime-400/50 dark:border-lime-400/30' : 'border-gray-200/50 dark:border-white/5'
                            }`}>
                            <p className={`text-2xl font-extrabold ${s.highlight ? 'text-lime-500 dark:text-lime-400' : 'text-gray-900 dark:text-white'}`}>{s.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Core Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-lime-500 dark:text-lime-400 mb-2">What drives us</p>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Our Core Values</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 hover:shadow-md transition-all duration-300"
                        >
                            <div className={`w-11 h-11 ${value.bg} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                <value.icon className={`w-5 h-5 ${value.color}`} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-lime-500 dark:text-lime-400 mb-2">The people behind it</p>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Meet the Team</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto text-sm">
                        A small but passionate group of developers committed to making blood donation easier for everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="group bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Avatar */}
                            <div className="relative inline-block mb-5">
                                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden ring-4 ring-white dark:ring-white/10 shadow-md">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-lime-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                            </div>

                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{member.name}</h3>
                            <p className="text-red-500 dark:text-red-400 font-semibold text-xs mt-1 uppercase tracking-wider">{member.role}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Banner */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-white/60 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl rounded-3xl p-10 text-center border border-gray-200/50 dark:border-white/10 overflow-hidden">
                    {/* Soft red glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-48 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs uppercase tracking-widest mb-5">
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            Make a difference
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                            Ready to save a life?
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm">
                            Join thousands of heroes who have already registered as blood donors on BloodBees.
                        </p>
                        <a
                            href="/register"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg shadow-red-500/20"
                        >
                            Become a Donor
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
