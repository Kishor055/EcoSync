# EcoSync Enterprise

EcoSync is a high-performance sustainability monitoring platform built for enterprise scalability. It helps users track energy and water consumption through a sophisticated dashboard with AI-powered optimization insights.

## 🚀 Features

- **Real-time Monitoring**: Track consumption across multiple appliance categories.
- **AI Sustainability Assistant**: Conversational AI (EcoBot) powered by Google Genkit and Gemini 1.5 Flash.
- **Deep Analytics**: Dynamic charts and reports visualizing YTD performance and resource efficiency.
- **Pro Design System**: A premium "Eco-Modern" UI built with ShadCN, Tailwind CSS, and Lucide icons.
- **Enterprise Architecture**: Decoupled service layer for maintainability and scalability.

## 🛠 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore, App Hosting)
- **AI**: [Google Genkit](https://github.com/firebase/genkit) (Gemini 1.5 Flash)
- **State Management**: React Hooks + Firebase Real-time Listeners
- **Architecture**: Service-Repository Pattern

## 🏗 Architecture

The project follows a modular Service-Repository pattern to ensure clean separation of concerns:

- `src/services`: Decoupled domain logic and Firebase integrations.
- `src/lib/types`: Centralized TypeScript interfaces and Zod schemas.
- `src/ai/flows`: Server-side AI logic using Genkit.
- `src/components`: Atomic design components optimized for performance.

## 📸 Dashboard Preview

![Dashboard Overview](https://picsum.photos/seed/ecosync-dash/1200/600)
*Enterprise Dashboard with AI Insights and Consumption Analytics*

![Analytics View](https://picsum.photos/seed/ecosync-reports/1200/600)
*Historical Usage Reports and Efficiency Trends*

## ⚙️ Setup & Installation

1. **Clone the Repository**
2. **Environment Variables**: Ensure you have the `GEMINI_API_KEY` set in your environment for AI features.
3. **Firebase Configuration**:
   - Create a Firebase Project.
   - Enable **Cloud Firestore** in production or test mode.
   - **CRITICAL**: Go to **Authentication > Sign-in method** and enable:
     - ✅ Anonymous
     - ✅ Google
     - ✅ Email/Password
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🛡 Security

- **RBAC**: Role-Based Access Control implemented via Firestore Security Rules.
- **Validation**: Strict client and server-side validation using Zod.
- **Sanitization**: Automatic sanitization of all user inputs.

## 📄 License

&copy; 2024 EcoSync Enterprise. All rights reserved.
