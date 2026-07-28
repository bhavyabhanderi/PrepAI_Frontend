# PrepAI - AI-Powered Interview Preparation Platform (Frontend)

Welcome to the frontend repository for **PrepAI**, a comprehensive, AI-driven platform designed to help candidates prepare for their dream jobs. It provides an intuitive, interactive, and highly dynamic user interface for managing profiles, analyzing resumes, and participating in various types of AI-assisted interviews.

## 🚀 Key Features

- **Comprehensive Interview Suite**:
  - **HR & Technical Interviews**: Realistic text-based mock interviews.
  - **Voice Interviews**: Real-time voice-to-voice interaction simulating actual phone/video screens.
  - **Coding Arena**: Integrated code editor for algorithm practice, SQL querying, and code debugging.
  - **System Design & Aptitude**: Specialized modules for architecture and logic-based assessments.

- **AI-Powered Analysis**:
  - **Resume Analyzer**: Drag-and-drop resume uploading with instant ATS scoring and feedback.
  - **Syllabus Analyzer**: Break down course materials into actionable learning topics.
  - **Topic Deep Dives**: Generate AI notes, chat with AI tutors, and take practice quizzes on specific subjects.

- **Modern UX/UI**:
  - **Fully Responsive**: Sleek design built with Tailwind CSS.
  - **Dark Mode**: Native, animated light/dark theme toggling.
  - **Micro-Animations**: Smooth transitions powered by Framer Motion.
  - **Secure Auth**: JWT & Google OAuth integration.

## 🎯 Core Functionalities

1. **User Authentication & Profiles**
   - Users can securely register and log in using JWT-based authentication or Google OAuth.
   - Profile management allows users to update personal details, technical skills, and preferences (like dark mode and notifications).

2. **Resume & Syllabus Analysis**
   - Candidates can upload their resumes in PDF format. The AI extracts key information, matches it against job descriptions, and provides an ATS score with actionable feedback.
   - The Syllabus Analyzer breaks down complex course materials into a structured, easy-to-follow study plan.

3. **Interactive Mock Interviews**
   - **Text-based Interviews**: Users answer dynamically generated questions for HR, Technical, System Design, and Aptitude rounds, receiving real-time AI feedback.
   - **Voice Interviews**: Simulates a real phone screen using speech-to-text and text-to-speech technologies.

4. **Coding Arena**
   - A built-in code editor (powered by Monaco Editor) where users can practice data structures and algorithms.
   - Includes specialized environments for **SQL Practice** and **Debugging**, allowing users to write, run, and evaluate code against test cases directly in the browser.

5. **Performance Tracking & Learning**
   - The interactive Dashboard visualizes user progress over time using charts.
   - AI generates personalized **Learning Plans** and **Performance Reports** based on interview results, highlighting strengths and suggesting areas for improvement.

## 🛠️ Tech Stack

- **Framework**: React 19 (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [Remix Icon](https://remixicon.com/) (`react-icons/ri`)

## ⚙️ Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## 🚀 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhavyabhanderi/PrepAI_Frontend.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the example environment file and fill in your details (e.g., Backend API URL):
   ```bash
   cp .env.example .env
   ```

## 💻 Running the Application

To start the Vite development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Build for Production

To build the application for production, run:

```bash
npm run build
```
This will generate optimized static assets in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 📂 Project Structure

- `src/`
  - `api/`: Axios instances and API request configurations.
  - `assets/`: Static images and global CSS files.
  - `components/`: Reusable, modular UI components (buttons, modals, charts).
  - `constants/`: Global constants, routing paths (`routes.js`), and configurations.
  - `context/`: React Contexts (e.g., ThemeContext for Dark Mode).
  - `hooks/`: Custom React hooks (e.g., `useIsMobile`).
  - `layouts/`: Master layouts wrapping pages (MainLayout, AuthLayout).
  - `pages/`: Full-page views mapping to routes (Dashboard, Interviews, Coding Arena).
  - `redux/`: Redux store setup and slices (`authSlice`, `uiSlice`).
  - `services/`: Service layers abstracting API calls (`authService`, `ratingService`).
  - `utils/`: Helper functions and common utilities.
