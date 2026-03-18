import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', // Combined First/Last for simplicity or adjust backend
        email: '',
        password: '',
        blood_group: '',
        role: 'donor',
        phone: '',
        location: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration Successful! Please login.');
                navigate('/login');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Registration Failed: Unable to connect to server. Is the backend running?');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="max-w-md w-full space-y-8 bg-white/60 backdrop-blur-xl dark:bg-[#1a1a1a]/40 dark:backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/5">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Join the community saving lives
                        </p>
                    </div>
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/70 dark:bg-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                                placeholder="Full Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/70 dark:bg-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                                placeholder="Email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="sr-only">Phone Number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                required
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/70 dark:bg-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                                placeholder="Phone Number"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="sr-only">Location/City</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/70 dark:bg-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                                placeholder="City / Area"
                            />
                        </div>

                        <div>
                            <label htmlFor="blood_group" className="sr-only">Blood Group</label>
                            <select
                                id="blood_group"
                                name="blood_group"
                                required
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200/50 dark:border-white/5 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/70 dark:bg-black/20 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                            >
                                <option value="" disabled selected className="bg-white dark:bg-[#1a1a1a]">Select Blood Group</option>
                                <option value="A+" className="bg-white dark:bg-[#1a1a1a]">A+</option>
                                <option value="A-" className="bg-white dark:bg-[#1a1a1a]">A-</option>
                                <option value="B+" className="bg-white dark:bg-[#1a1a1a]">B+</option>
                                <option value="B-" className="bg-white dark:bg-[#1a1a1a]">B-</option>
                                <option value="AB+" className="bg-white dark:bg-[#1a1a1a]">AB+</option>
                                <option value="AB-" className="bg-white dark:bg-[#1a1a1a]">AB-</option>
                                <option value="O+" className="bg-white dark:bg-[#1a1a1a]">O+</option>
                                <option value="O-" className="bg-white dark:bg-[#1a1a1a]">O-</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                onChange={handleChange}
                                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white/70 dark:bg-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                                placeholder="Password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all transform hover:-translate-y-0.5"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
