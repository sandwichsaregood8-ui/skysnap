# **App Name**: SkySnap

## Core Features:

- Secure User Authentication: Enable users to sign in and manage their accounts using Firebase Authentication for secure access to their captures.
- Device Connectivity & Setup: Facilitate seamless BLE to WiFi provisioning for ESP32 camera devices, allowing for easy camera setup and connection to the user's home network.
- Smart Image Capture & Upload: Manage the intelligent upload of multi-frame image bursts from the ESP32 camera to Firebase Storage, ready for cloud-based computational processing.
- Intelligent Image Processing Pipeline: Execute a sophisticated multi-frame computational photography pipeline (including alignment, HDR fusion, noise reduction, detail enhancement, and artistic color grading) via Firebase Cloud Functions to produce ultra-high-quality final images from burst captures.
- Capture Metadata Management: Store and retrieve essential image capture metadata and ESP32 device states efficiently using Firebase Firestore.
- Personalized SkySnap Gallery: Provide a secure and visually appealing gallery for users to view, manage, and retrieve their processed sky images, fetched directly from Firebase Storage.
- Dynamic Wallpaper Integration: Offer a feature to update device wallpapers automatically with the latest processed SkySnap image on Android, and provide an interactive picker for iOS users.

## Style Guidelines:

- Primary Color: A vibrant and energetic purple (#7c3aed) that conveys technological sophistication and stands out clearly against dark backgrounds.
- Background Color: A very dark, deep desaturated purple (#16141a) to create an immersive, cosmic backdrop, subtly echoing the primary hue.
- Accent Color: A clear and vivid blue (#1954e5), analogous to the primary, used to highlight secondary interactive elements and evoke a celestial feel.
- Headline and body text font: 'Plus Jakarta Sans' (sans-serif) for its modern, clean, and highly readable design across all text elements. Note: currently only Google Fonts are supported.
- Utilize 'Material Symbols Outlined' for all icons, maintaining a consistent, contemporary, and easily recognizable visual language across the application.
- Implement a clean, card-based 'glassmorphism' layout that provides depth and a premium aesthetic, centering key content for focus and clarity. Visual cues like chromatic borders and ambient glows will enhance interactive elements.
- Incorporate subtle, smooth transitions and micro-interactions for an enhanced user experience. Dynamic elements such as rotating chromatic borders and an evolving background shader animation will add a consistent sense of motion and modernity.