import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Heart, ArrowRight } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                    Welcome, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    What brings you to BloodBees today? Select an option below to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {/* Donate Choice */}
                <button
                    onClick={() => navigate('/donate')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-white/60 dark:bg-[#1a1a1a]/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-all duration-300 ring-4 ring-white dark:ring-gray-800">
                        <Heart className="w-10 h-10 fill-current" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        I'm here to Donate
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        Save lives by pledging blood or browsing urgent requests nearby.
                    </p>
                    <div className="mt-auto flex items-center text-red-600 dark:text-red-400 font-bold text-sm">
                        Proceed to Directory <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                {/* Receive Choice */}
                <button
                    onClick={() => navigate('/request')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-white/60 dark:bg-[#1a1a1a]/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all duration-300 ring-4 ring-white dark:ring-gray-800">
                        <Droplet className="w-10 h-10 fill-current" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        I need Blood
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        Create an urgent blood request to notify donors in your area immediately.
                    </p>
                    <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                        Start a Request <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
        </div>
    );
};
export default Welcome;
