# AV Academy Codebase Overview

This document provides a comprehensive overview of the AV Academy codebase, summarizing the project architecture, features, and recent implementation history.

## Technology Stack

- **Frontend Framework:** React 19 + Vite
- **Styling:** Vanilla CSS with custom animations (CSS modules/stylesheets per component)
- **Animation Engine:** GSAP (GreenSock Animation Platform) for robust scroll-driven and entry animations
- **Analytics:** Vercel Analytics (`@vercel/analytics`)
- **Backend/Database:** Google Apps Script (`gasService.js`) handling submissions and auto-triggered emails
- **Deployment:** Vercel (configured via `vercel.json`)

## Directory Structure

```text
av academy/
├── website/
│   ├── public/              # Static assets (images, videos, fonts)
│   ├── src/                 # Main source code
│   │   ├── components/      # React components and CSS files
│   │   ├── config/          # Configuration files (e.g., googleAuth.js)
│   │   ├── data/            # JSON data (e.g., probability_quiz.json)
│   │   ├── hooks/           # Custom React hooks (e.g., useReveal.js)
│   │   ├── utils/           # Utility functions (e.g., gasService.js)
│   │   ├── App.jsx          # Root application component
│   │   ├── index.css        # Global CSS and CSS variables
│   │   └── main.jsx         # React application entry point
│   ├── package.json         # Project dependencies and npm scripts
│   ├── vite.config.js       # Vite configuration
│   └── vercel.json          # Vercel deployment configuration
```

## Key Components

The UI is built modularly with matching `.jsx` and `.css` files for each component.

### General UI Sections
- **`Navbar`**: Fixed, responsive navigation bar.
- **`Hero`**: Landing section with dynamic typography.
- **`Marquee`**: Animated text banner.
- **`About`**: Cinematic section featuring synchronized image pop-outs, overlaps, and quote boxes (fully mobile-optimized).
- **`Works`**: Acts as a course timeline offering a visual breakdown of syllabus progress.
- **`ChapterModal`**: An interactive modal providing deep-dives into specific chapters, titles, and mark distributions.
- **`Youtube`**: Video content hub section built with mobile-optimized grid structures.
- **`Stats` & `Expertise`**: Highlight specialized metrics.
- **`Contact`**: A highly structured 2x2 grid linking out to mail, location, and social links.
- **`Preloader` & `Cursor`**: Custom UX elements for loading states and cursor styling.

### Exam System (`Quiz*` components)
The core instructional engine includes a highly robust, secure exam platform designed to standard entry criteria (e.g., CUET):
- **`QuizController` / `Quiz`**: The state engine managing the flow from onboarding to review.
- **`QuizOnboarding` & `QuizAuth`**: Student entry and identification.
- **`QuizProctor`**: Exam security logic, including tab-switching detection and timing mechanisms.
- **`QuizAnalysis` / `QuizResult`**: Result reporting with interactive leaderboards and actionable insights.

## Major Features & Implementations

### 1. AV Academy Secure Exam System
- **Scoring Engine:** Implemented CUET-standard evaluation (+5 corresponding to correct answers, -1 for incorrect, and 0 for unattempted).
- **Google Apps Script Integration:** Formulated a modular script integration (`gasService.js`) synced stringently on the frontend to avoid submission races using `Promise.all`.
- **Security & Auto-Alerts:** Automated "Unfair Means" tracking logic. Any test completed under a threshold (e.g., 25 minutes) triggers real-time administrative email notifications.
- **Leaderboard:** Engaging modal UI to securely fetch and display high-scores.

### 2. Mobile UI and Animation Overhaul
- **Hardware-Accelerated Mobile UX:** Transitioned from static layouts to performant, cinematic animations (using `transform` and `opacity` properties) powered by GSAP for `Courses` and `Youtube` clusters.
- **Typography & Grid Alignments:** Perfected the responsiveness across various domains, notably text size refactoring for "Stop Memorizing" quotes and exact alignments for `Contact` details.
- **Scroll Optimizations:** Built a static, multi-line ("LESS STRESS.", "MORE MARKS.", "BETTER MATHS.") text-holding interaction before unleashing the mobile page scroll.

### 3. Vercel Enhancements
- Deployed the build securely to Vercel.
- Activated `@vercel/analytics` directly within the Vite application shell to track visitor metrics effectively.

---
*Generated based on the most recent project lifecycle events and file tracking analysis.*
