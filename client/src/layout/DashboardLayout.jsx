import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, Users, Activity, Settings, LogOut, Menu, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Sidebar from '../components/Sidebar';
import NotificationDropdown from '../components/NotificationDropdown';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/donate', label: 'Find Blood', icon: Search },
        { path: '/request', label: 'Request Blood', icon: Activity },
        { path: '/profile', label: 'My Profile', icon: Users },
        { path: '/about', label: 'About Us', icon: Users },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200
            bg-[#f8fafc] [background-image:radial-gradient(ellipse_at_top_center,rgba(225,29,72,0.25)_0%,transparent_70%)]
            dark:bg-[#141414] dark:[background-image:radial-gradient(ellipse_at_bottom_center,rgba(244,63,94,0.15)_0%,transparent_70%)]">

            {/* Sidebar (Overlay) */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                variant="overlay"
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header (Pills) */}
                <div className="fixed top-4 left-0 right-0 z-40 flex justify-between px-6 lg:px-8 pointer-events-none transition-all duration-300">
                    {/* Left Pill */}
                    <header className="h-14 bg-white/40 dark:bg-[#1a1a1a]/50 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-none rounded-full pointer-events-auto border border-white/20 dark:border-white/5 flex items-center px-4 sm:px-5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu Button */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                                    <Heart className="w-5 h-5 text-red-600 dark:text-red-500 fill-current" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
                                    Blood<span className="text-red-600 dark:text-red-500">Bees</span>
                                </span>
                            </Link>
                        </div>
                    </header>

                    {/* Right Pill */}
                    <header className="h-14 bg-white/40 dark:bg-[#1a1a1a]/50 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-none rounded-full pointer-events-auto border border-white/20 dark:border-white/5 flex items-center px-4 sm:px-5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {user ? (
                                <>
                                    <NotificationDropdown user={user} />

                                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-sm font-bold text-red-600 dark:text-red-400 border border-white dark:border-gray-600 shadow-sm">
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </header>
                </div>

                {/* Main Content Areas */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 pt-24 lg:pt-24 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
