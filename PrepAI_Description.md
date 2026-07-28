# PrepAI - AI Interview Preparation Platform

## Project Overview
**PrepAI** is a comprehensive, AI-powered interview preparation platform designed to help candidates practice, evaluate, and elevate their interviewing skills. It provides a seamless, interactive environment where users can manage their profiles, upload resumes, and engage in realistic AI-driven mock interviews and coding assessments. The platform focuses on delivering a premium user experience with dynamic animations, intuitive data visualizations, and robust performance.

## Core Features
- **AI Mock Interviews:** Offers interactive interfaces for both behavioral (HR) and technical interviews, featuring voice interactions to simulate real-world scenarios.
- **Coding Arena:** An integrated coding environment powered by Monaco Editor, allowing users to practice, run, and evaluate algorithmic problems directly within the browser.
- **Smart Resume Parsing:** Features a drag-and-drop resume upload functionality built with `react-dropzone` for easy document handling.
- **Interactive Dashboards:** Provides visual insights into the user's progress and performance using dynamic charts (`recharts`).
- **Secure Authentication:** Seamless and secure onboarding through JWT-based login and Google OAuth integration.
- **Beautiful UI/UX:** A highly responsive, modern interface styled with Tailwind CSS v4 and enriched with smooth micro-animations using Framer Motion. It includes polished notifications and alerts (via `react-hot-toast` and `sweetalert2`).

## Technology Stack (Frontend)
The frontend is architected using a modern, scalable tech stack:
- **Framework & Build Tool:** React 19 powered by Vite for blazing-fast development and optimized production builds.
- **Styling & Animation:** Tailwind CSS v4 for utility-first styling and Framer Motion for sophisticated animations.
- **State Management & Data Fetching:** A powerful combination of Redux Toolkit for global state and React Query for efficient asynchronous data fetching and caching.
- **Form Handling:** React Hook Form for performant, flexible, and extensible form validation.
- **Routing:** React Router DOM for seamless single-page application navigation.
