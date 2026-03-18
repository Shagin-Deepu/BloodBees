/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e', // Blood red
                    600: '#e11d48',
                    700: '#be123c',
                    800: '#9f1239',
                    900: '#881337',
                },
                // Custom neutral gray palette based on #1f1f1f
                gray: {
                    50: '#fdfdfd',
                    100: '#f7f7f7',
                    200: '#f0f0f0',
                    300: '#e0e0e0',
                    400: '#bdbdbd',
                    500: '#9e9e9e',
                    600: '#757575',
                    700: '#616161',
                    800: '#2d2d2d', // Lighter shade for cards
                    900: '#1f1f1f', // Base dark mode color (Requested)
                    950: '#141414', // Darker shade
                }
            }
        },
    },
    plugins: [],
}
