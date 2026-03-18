import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <div className="fixed top-4 left-0 right-0 z-50 flex justify-between px-4 sm:px-6 pointer-events-none">
                {/* Left Pill */}
                <nav className="transition-all duration-300 bg-white/40 dark:bg-[#1a1a1a]/50 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-none rounded-full pointer-events-auto border border-white/20 dark:border-white/5">
                    <div className="px-4 sm:px-5">
                        <div className="flex h-14 items-center">
                            <div className="flex items-center gap-4">
                                {/* Hamburger Menu Button */}
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>

                                {/* Logo */}
                                <Link to="/" className="flex items-center gap-2">
                                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                                        <Heart className="w-5 h-5 text-red-600 dark:text-red-500 fill-current" />
                                    </div>
                                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight hidden sm:block">
                                        Blood<span className="text-red-600 dark:text-red-500">Bees</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Right Pill */}
                <nav className="transition-all duration-300 bg-white/40 dark:bg-[#1a1a1a]/50 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-none rounded-full pointer-events-auto border border-white/20 dark:border-white/5">
                    <div className="px-4 sm:px-5">
                        <div className="flex h-14 items-center">
                            <div className="flex items-center gap-4">
                                {/* Theme Toggle (Desktop) */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hidden sm:block"
                                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <NotificationDropdown user={user} />

                                        <Link to={user.role === 'admin' ? '/godmode' : '/profile'} title={user.role === 'admin' ? 'Go to God Mode' : 'Go to Profile'} className="flex items-center gap-2 group">
                                            <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-700 dark:text-red-400 font-bold border border-red-200 dark:border-red-800 group-hover:bg-red-200 dark:group-hover:bg-red-900/30 transition-colors">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                            title="Logout"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
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
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sidebar / Drawer */}
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} variant="overlay" />
        </>
    );
};

export default Navbar;
