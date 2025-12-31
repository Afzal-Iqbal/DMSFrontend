# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
🌍 DonationHub - MERN Management System
DonationHub is a full-stack platform designed to bridge the gap between donors and charitable causes. It provides a secure, transparent environment for managing campaigns, tracking donations, and analyzing community impact.

🚀 Technical Highlights
Frontend Infrastructure
Modern UI/UX: Built using Vite for speed, styled with Tailwind CSS and Shadcn UI for a high-fidelity, mobile-first design.

Robust Form Logic: Integrated Formik and Yup to ensure clean, validated data entry for all authentication and donation flows.

State & Routing: Utilizes React Router Dom for seamless navigation and Context API for global user session management.

Backend & Security
Role-Based Access Control (RBAC): Distinct permissions for Admins and Users, protecting sensitive management tools from unauthorized access.

Secure Authentication: Implementation of JWT (JSON Web Tokens) stored in local storage and attached to every request via Axios interceptors.

Database Management: Powered by MongoDB with optimized Mongoose schemas for campaigns, users, and donation history.

🛠️ Key Features
Admin Suite: Create, edit, and delete campaigns; monitor global donation stats in real-time.

User Dashboard: Personal impact tracking, donation history, and real-time progress bars for active causes.

Secure Payments: Mock payment gateway integration supporting Online, Transfer, and Cash methods.

AI-Assisted Content: Specialized logic for generating campaign descriptions using AI to help admins launch causes faster.

📦 Installation & Setup
Clone the repository.

Install dependencies for both /frontend and /backend using npm install.

Set up your .env file with your MONGO_URI and JWT_SECRET.

Run npm run dev to start the development servers.