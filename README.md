# Personalized Content Dashboard

> 🚀 Developed as part of the PGAGI SDE Intern Frontend Assessment

A full-stack personalized content dashboard that integrates real-time news, movie recommendations, and social content into a unified, interactive user experience.

## 📸 Screenshots
- Dashboard view
- Favorites
- Dark mode

## 🎥 Demo
[Watch Demo Video](your-loom-link)



## 🔌 API Integration

- **News API** → Fetches real-time news articles tailored to user category preferences.
- **TMDB API** → Provides high-quality movie recommendations, posters, and metadata.
- **Google Gemini AI API** → Used to enhance the user experience by providing on-demand **AI Summaries** and **Sentiment Analysis** for complex news articles directly inside the News Cards.
- **Mock Social Media API** → A custom-built mock API route to simulate an engaging social media feed of top posts.

## ⚠️ Disclaimer

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 🌟 Core Features
- **Unified Feed**: Seamlessly interleaves NewsAPI data, TMDB Movie Recommendations, and Mock Social posts.
- **Infinite Scrolling**: Automatically loads more content as you scroll down the dashboard.
- **Debounced Search**: Optimized global search bar with instant `Enter` key override.
- **Authentication**: Robust login and session management powered by **NextAuth.js**, featuring secure route protection via Next.js Middleware.
- **Drag-and-Drop Favorites**: Save your favorite articles and visually reorder them in your Favorites tab using `@dnd-kit`.
- **Advanced State Management**: Powered by **Redux Toolkit** and heavily utilizes custom LocalStorage middleware for session persistence.
- **Premium UI/UX**: Built with Tailwind CSS and **Framer Motion**, featuring smooth page transitions, micro-interactions, and a global Dark Mode toggle.

## 🛠️ Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js (Auth.js)
- **State Management**: Redux Toolkit + React-Redux
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit/core
- **Testing**: Vitest (Unit/Integration) & Cypress (E2E)

## ⚙️ Project Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd pgagi-personalized-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your required keys:
```env
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_optional
NEXTAUTH_SECRET=your_super_secret_jwt_key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

This project includes comprehensive testing covering edge cases, state logic, and critical user flows.

**Run Unit & Integration Tests (Vitest)**:
```bash
npm run test
```

**Run End-to-End Tests (Cypress)**:
```bash
npx cypress open
```
*Note: Ensure the local dev server is running on port 3000 before executing E2E tests.*

## 🗺️ User Flow
1. **Onboarding**: Users land on the main dashboard where a unified feed of global news and TMDB movie recommendations is presented.
2. **Personalization**: Users can navigate to the Settings tab to toggle Dark Mode and update their preferred News Categories (e.g., Technology, Business). This is saved instantly to LocalStorage.
3. **Searching**: Users can search for specific topics using the debounced search bar in the header.
4. **Curating**: Users can click the "Bookmark" icon on any card to save it.
5. **Organizing**: Users navigate to the "Favorites" tab where they can visually drag-and-drop their saved content to reorder it to their liking.
