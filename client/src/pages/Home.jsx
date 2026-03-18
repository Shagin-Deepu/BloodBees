import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Users, Heart, Activity, Droplet } from 'lucide-react';
import BreathingHeart from '../components/BreathingHeart';

const Home = () => {
    const [statsData, setStatsData] = useState({
        donors: 0,
        livesSaved: 0,
        requests: 0,
        units: 0
    });

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
                if (response.ok) {
                    const data = await response.json();
                    setStatsData(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                // Fallback to initial state or handle error visually if needed
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { label: 'Registered Donors', value: (statsData?.donors || 0).toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40' },
        { label: 'Lives Saved', value: (statsData?.livesSaved || 0).toLocaleString() + '+', icon: Heart, color: 'text-lime-500', bg: 'bg-lime-100 dark:bg-lime-900/30' },
        { label: 'Requests Fulfilled', value: (statsData?.fulfilled || 0).toLocaleString(), icon: Activity, color: 'text-lime-400', bg: 'bg-lime-50 dark:bg-lime-900/20' },
        { label: 'Units Collected', value: (statsData?.units || 0).toLocaleString(), icon: Droplet, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    ];

    return (
        <div className="font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden transition-colors duration-200">
                <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row relative">
                    {/* Text Container */}
                    <div className="relative z-10 w-full lg:w-1/2 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 pt-10 sm:pt-12 md:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Donate blood,</span>{' '}
                                <span className="block xl:inline">
                                    <span className="text-lime-400 dark:text-lime-400">save</span>
                                    <span className="text-red-600 dark:text-red-500"> a life today.</span>
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Join our community of heroes. Your simple act of kindness can give someone another chance at life. Connect directly with those in need.
                            </p>
                            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                                <Link to={user ? "/donate" : "/register"} className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg transition-colors shadow-sm">
                                    Donate Now
                                </Link>
                                <Link to="/donate" className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border-2 border-lime-400 dark:border-lime-400 text-base font-medium rounded-lg text-lime-600 dark:text-lime-400 hover:bg-lime-400/10 md:py-4 md:text-lg transition-colors shadow-sm">
                                    Find a Donor
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Heart Container */}
                    <div className="w-full lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center py-12 lg:py-0 relative z-0">
                        <BreathingHeart />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/60 dark:backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none border border-gray-200/50 dark:border-white/5 rounded-xl hover:shadow-md transition-all duration-300">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-lg p-3 ${stat.bg} mix-blend-lighten`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color} opacity-90`} aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate tracking-wide">{stat.label}</dt>
                                            <dd className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Information Section */}
            <div className="py-16 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-lime-500 dark:text-lime-400 font-semibold tracking-wide uppercase">Why Donate?</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            A single drop can start a wave
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                            Blood donation is a vital part of healthcare and every donation counts.
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
                            {[
                                { title: 'Health Benefits', desc: 'Donating blood can reduce the risk of heart disease and liver ailments by lowering iron levels in the body.', icon: Activity },
                                { title: 'Community Impact', desc: 'One donation can save up to three lives. You are directly contributing to the well-being of your community.', icon: Users },
                                { title: 'Free Health Checkup', desc: 'Before every donation, you get a free mini-physical checkup including pulse, blood pressure, and hemoglobin levels.', icon: Droplet },
                                { title: 'Emergency Needs', desc: 'Blood is needed every 2 seconds. Your donation ensures that blood is available when accidents or surgeries happen.', icon: Heart },
                            ].map((item, index) => (
                                <div key={index} className="relative bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl p-6 rounded-2xl border border-gray-200/50 dark:border-white/5 hover:bg-white/80 dark:hover:bg-[#1a1a1a]/60 transition-all duration-300">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                            <item.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-semibold text-gray-900 dark:text-white">{item.title}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-600 dark:text-gray-400">
                                        {item.desc}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            <footer className="bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl border-t border-gray-200/50 dark:border-white/5 transition-colors duration-200 text-gray-800 dark:text-gray-400">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-base">
                        &copy; 2026 BloodBees Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
