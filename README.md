# PrepAI - AI Interview Preparation Platform Frontend

This is the frontend application for **PrepAI**, an AI-powered interview preparation platform. It provides the user interface for candidates to manage their profiles, upload resumes, and participate in AI-driven mock interviews, voice interactions, and coding assessments.

## Tech Stack

The application is built using modern web technologies:

- **Framework**: React 19 (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) for animations
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (for coding assessments)
- **Icons**: [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/)

## Features

- **Authentication**: Seamless login and registration with JWT and Google OAuth integration.
- **Interactive Dashboards**: Data visualization using `recharts`.
- **Mock Interviews**: Interactive UI for HR and technical interviews.
- **Coding Arena**: Integrated code editor to practice and evaluate coding problems.
- **Resume Uploads**: Drag-and-drop resume upload functionality using `react-dropzone`.
- **Beautiful UI/UX**: Sleek, responsive design with dynamic animations and notifications (using `react-hot-toast` and `sweetalert2`).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhavyabhanderi/PrepAI_Frontend.git
   cd PrepAI/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the example environment file and fill in your details (e.g., Backend API URL, OAuth keys):
   ```bash
   cp .env.example .env
   ```

## Running the Application

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

To preview the production build, run:

```bash
npm run preview
```

## Project Structure

- `src/`: Main source code directory.
  - `api/`: API integration and request handlers.
  - `assets/`: Static assets like images and global CSS.
  - `components/`: Reusable React components (buttons, modals, form elements).
  - `constants/`: Application-wide constants and configurations.
  - `context/`: React context providers.
  - `hooks/`: Custom React hooks.
  - `layouts/`: Shared layout components (e.g., Navbar, Sidebar, Footer).
  - `pages/`: Top-level page components (e.g., HRInterview, Dashboard, Login).
  - `redux/`: Redux store, slices, and asynchronous thunks.
  - `services/`: Specific logic for interacting with external services.
  - `utils/`: Helper and utility functions.
