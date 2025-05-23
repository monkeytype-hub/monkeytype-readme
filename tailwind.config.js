/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}", "./public/views/*.html", "./public/views/*.ejs"],
    theme: {
        extend: {
            colors: {
                "nord-light-green": "#8fbcbb",
                "nord-light-bg": "#eceff4",
                "nord-light-subAlt": "#d8dee9",
                "nord-light-sub": "#6a7791",
                "nord-light-error": "#bf616a",
                "code-bg-brown": "#f5f2f0",
                "code-bg-black": "#999",
            },
            width: {
                26: "6.5rem",
                33: "8.25rem",
                34: "8.5rem",
            },
            margin: {
                38: "9.5rem",
            },
            animation: {
                "rgb-bg": "rgb-bg 10s linear infinite",
            },
            keyframes: {
                "rgb-bg": {
                    "0%": { "background-color": "hsl(120, 39%, 49%)" },
                    "20%": { "background-color": "hsl(192, 48%, 48%)" },
                    "40%": { "background-color": "hsl(264, 90%, 58%)" },
                    "60%": { "background-color": "hsl(357, 89%, 50%)" },
                    "80%": { "background-color": "hsl(46, 100%, 51%)" },
                    "100%": { "background-color": "hsl(120, 39%, 49%)" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animated")],
};
