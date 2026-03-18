import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Activity, User, Info, LogOut, X, Heart, Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Sidebar = ({ isOpen, onClose, variant = 'persistent' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { theme, toggleTheme } = useTheme();

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
    ];

    if (user && user.role === 'admin') {
        navItems.push({ path: '/godmode', label: 'God Mode', icon: Shield });
        navItems.push({ path: '/about', label: 'About Us', icon: Info });
    } else {
        navItems.push({ path: '/profile', label: 'My Profile', icon: User });
        navItems.push({ path: '/about', label: 'About Us', icon: Info });
    }

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white/70 backdrop-blur-3xl dark:bg-[#1a1a1a]/60 dark:backdrop-blur-3xl border-r border-gray-200/50 dark:border-white/5 transition-colors duration-200">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-white/5">
                <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                        <Heart className="w-5 h-5 text-red-600 dark:text-red-500 fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                        Blood<span className="text-red-600 dark:text-red-500">Bees</span>
                    </span>
                </Link>
                {variant === 'overlay' && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.path)
                            ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 shadow-sm ring-1 ring-red-100 dark:ring-red-500/20'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gray-200/50 dark:border-white/5 space-y-3">
                {/* Theme Toggle Mobile/Sidebar */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                >
                    <span className="flex items-center gap-2">
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-yellow-500" />
                    ) : (
                        <Moon className="w-4 h-4 text-gray-500" />
                    )}
                </button>

                {user ? (
                    <>
                        <div className="flex items-center px-2 py-2">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm">
                                {user.name[0].toUpperCase()}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-gray-700 dark:text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div className="space-y-2">
                        <Link
                            to="/login"
                            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="flex justify-center w-full px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm hover:shadow transition-all duration-200"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );

    if (variant === 'overlay') {
        return (
            <div className={`fixed inset-0 z-50 flex ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                ></div>
                {/* Sliding Panel */}
                <div
                    className={`relative flex-1 flex flex-col max-w-xs w-full shadow-xl h-full transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    {sidebarContent}
                </div>
            </div>
        );
    }

    return (
        <aside className="w-64 hidden md:flex flex-col h-full shadow-sm">
            {sidebarContent}
        </aside>
    );
};

export default Sidebar;
