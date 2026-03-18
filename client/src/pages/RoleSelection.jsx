import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Droplet, HandHeart } from 'lucide-react'; // Make sure lucide-react is installed, typically it is in this stack

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#121212] transition-colors duration-200">
                <div className="max-w-4xl w-full space-y-8 text-center">
                    <div>
                        <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
                            How can we help today?
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Choose your path. Whether you're here to save a life or in need of support, you're in the right place.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {/* Donate Card */}
                        <button
                            onClick={() => navigate('/donate')}
                            className="group relative flex flex-col items-center justify-center p-10 bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/80 dark:hover:bg-[#1a1a1a]/80"
                        >
                            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                                <HandHeart size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                I Want to Donate
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                View current blood requests and pledge to donate blood to those in need.
                            </p>
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-3xl transition-colors duration-300 pointer-events-none"></div>
                        </button>

                        {/* Receive Card */}
                        <button
                            onClick={() => navigate('/request')}
                            className="group relative flex flex-col items-center justify-center p-10 bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/80 dark:hover:bg-[#1a1a1a]/80"
                        >
                            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <Droplet size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                I Need Blood
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                Create a new request for blood and connect with willing donors in your area.
                            </p>
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-3xl transition-colors duration-300 pointer-events-none"></div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoleSelection;
