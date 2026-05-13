# EcoSync Enterprise

EcoSync is a high-performance sustainability monitoring platform built for enterprise scalability.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, ShadCN UI, Recharts, Framer Motion
- **Backend**: Firebase (Firestore, Auth, App Hosting)
- **AI**: Google Genkit (Gemini 1.5 Flash)
- **Architecture**: Service-Repository Pattern

## Architecture
- `src/services`: Decoupled domain logic and Firebase integrations.
- `src/lib/types`: Centralized TypeScript interfaces and Zod schemas.
- `src/ai/flows`: Server-side AI logic using Genkit.
- `src/components`: Atomic design components optimized for performance.

## Setup
1. Clone the repository.
2. Ensure you have the `GEMINI_API_KEY` in your environment.
3. Enable **Google**, **Email**, and **Anonymous** sign-in providers in the Firebase Console.
4. Deploy using Firebase App Hosting.

## Security
- Role-Based Access Control (RBAC) via Firestore Security Rules.
- Contextual error handling for Permission Denied errors.
- Sanitized client-side mutations.
=======
# EcoSync
>>>>>>> 208f54b0e4ab8ccc2e4e192686b1c8b914acefb1
