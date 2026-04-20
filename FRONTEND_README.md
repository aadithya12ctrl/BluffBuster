# 🔴 BLUFFBUSTER FRONTEND 🔴

**Forensic Pitch Deck Analysis UI — Built for Speed, Style, and Suspense.**

This document provides a comprehensive, deep-dive overview of the BluffBuster frontend application. It is meant for developers, designers, and maintainers who want to understand the exact mechanics behind the Retro Arcade × Dark Forensics aesthetic, the React component tree, the global state management, and the bespoke animation systems that make the platform feel alive.

---

## 📑 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack & Tooling](#2-tech-stack--tooling)
3. [Design System & Aesthetics](#3-design-system--aesthetics)
4. [Global Animation Mechanics](#4-global-animation-mechanics)
5. [Routing & Application State](#5-routing--application-state)
6. [Component Deep Dive: Landing Page](#6-component-deep-dive-landing-page)
7. [Component Deep Dive: Dashboard (Founder Mode)](#7-component-deep-dive-dashboard-founder-mode)
8. [Component Deep Dive: Dashboard (VC Mode)](#8-component-deep-dive-dashboard-vc-mode)
9. [Custom Hooks](#9-custom-hooks)
10. [Styling and CSS (Tailwind + Custom)](#10-styling-and-css)
11. [API Integration Layer](#11-api-integration-layer)
12. [Performance Considerations](#12-performance-considerations)

---

## 1. Architecture Overview

The BluffBuster frontend is a modern, single-page application (SPA) built with React 19. It is designed to be highly responsive, visually striking, and capable of displaying complex, real-time data streaming from the backend's LangGraph agents.

### Core Principles
- **Cinematic Experience:** The UI is not just a dashboard; it's a narrative. It uses custom cursors, floating 3D elements, and smooth scrolling to guide the user.
- **Component Modularity:** Every major piece of analysis (e.g., Financial Stress Test, Competitor Map) is isolated into its own self-contained React component.
- **Graceful Degradation:** The UI handles partial or missing data gracefully, utilizing Error Boundaries and optional chaining to prevent black-screen crashes.
- **Zero-Latency Demos:** The app supports a seamless fallback to pre-computed JSON files (`demo_founder.json`, `demo_vc.json`) to guarantee a flawless live presentation.

---

## 2. Tech Stack & Tooling

We chose a cutting-edge stack to ensure maximum performance and developer velocity:

*   **React 19:** The core UI library, leveraging the latest hook patterns and concurrent rendering capabilities.
*   **Vite 6.2:** The blazing-fast build tool and development server. Hot Module Replacement (HMR) allows for instant visual feedback during design tweaks.
*   **TypeScript 5.8:** Provides strict type safety across the entire codebase, ensuring that the complex JSON structures returned by the backend LLM are handled safely.
*   **TailwindCSS 4.1:** Used for utility-first styling. We extensively customized the Tailwind theme to include our specific "forensic" color palette and custom fonts.
*   **Framer Motion 12.x:** The backbone for nearly all component-level animations (fade-ins, spring physics, layout transitions).
*   **GSAP (GreenSock) 3.15:** Used specifically for complex, scroll-linked animations where Framer Motion might lack the necessary granular control (e.g., the horizontal scroll in the Problem Section).
*   **Lenis 1.3:** A lightweight, highly performant smooth-scrolling library that drastically improves the feel of the application over standard browser scrolling.
*   **Zustand 5.0:** Used for minimal, boilerplate-free global state management (specifically for tracking the active user mode: Founder vs. VC).
*   **Recharts 3.8:** Used for rendering the trust score gauge chart and other data visualizations.
*   **Lucide React 0.546:** A clean, consistent icon library.

---

## 3. Design System & Aesthetics

The visual identity of BluffBuster is defined by a clash of themes: **Retro Arcade** meets **Dark Forensics**. It is cynical, high-tech, and slightly aggressive.

### Color Palette
The app relies on a strict, high-contrast palette defined in the Tailwind configuration and custom CSS variables:

*   `bg-background` (`#0A0A0F` / `#050508`): Deep void black. The canvas.
*   `text-off-white` (`#F0F0F5`): Primary text color, slightly warm to reduce eye strain against the black background.
*   `text-muted-forensic` (`#7A7A9A`): Used for secondary text, labels, and timestamps.
*   `text-red-forensic` (`#FF3D3D`): Indicates FALSE claims, critical red flags, and danger.
*   `text-amber-forensic` (`#FF9500`): Indicates EXAGGERATED claims, warnings, and unverified data.
*   `text-green-forensic` (`#00C896`): Indicates VERIFIED claims, safe data, and positive trajectories.

### Typography
Two primary fonts drive the aesthetic:
1.  **Press Start 2P (`font-pixel`):** Used for dramatic headers, system prompts, data tags, and buttons. It enforces the "Retro Arcade" feel.
2.  **Bebas Neue (`font-bebas`):** Used for large section titles and aggressive callouts.
3.  *(Secondary)* **Space Grotesk & DM Sans:** Used for body copy where readability is paramount over stylistic flair.

### The `.glass` Component Paradigm
Instead of flat rectangles, all panels and cards utilize a custom `.glass` CSS class.
This class applies a mathematically precise `clip-path` and `border-image` to create an 8-bit, chamfered corner effect while maintaining a frosted glass (`backdrop-filter`) transparency.

Variations include `.glass-red`, `.glass-amber`, and `.glass-green`, which inject subtle tinted backgrounds and drop shadows to color-code the panels.

---

## 4. Global Animation Mechanics

The application feels alive because of several global animation systems layered behind the React router views.

### 1. Global Background Orbs (`GlobalBackground.tsx`)
Rendered deeply behind everything, three massive, blurred circles (red, amber, green) orbit the screen.
*   **Implementation:** CSS `@keyframes blob` using `transform: translate()` mixed with massive `blur()` filters.
*   **Effect:** A constantly shifting, moody gradient atmosphere that reacts uniquely because of `mix-blend-screen`.

### 2. Floating 3D Symbols (`App.tsx`)
Scattered across the background are floating typographical symbols (`$`, `!`, `?`, `X`, `#`, `%`).
*   **Implementation:** CSS `@keyframes float-slow` and `float-fast`.
*   **Styling:** They use a custom `.retro-text-3d` class which stacks multiple offset `drop-shadow` filters to create fake 3D depth.

### 3. CRT Scanline Overlay
*   **Implementation:** A fixed, `pointer-events-none` div covering the whole screen with a repeating linear gradient that mimics the interlacing lines of an old CRT monitor.

### 4. Custom Crosshair Cursor (`CustomCursor.tsx`)
Replaces the standard browser cursor with a forensic target icon (`<Target />` from Lucide).
*   **Implementation:** Listens to `mousemove` events and translates a floating fixed div to the cursor coordinates.

---

## 5. Routing & Application State

### React Router Setup
The application uses a simple, flat routing structure via `react-router-dom`:
*   `/` -> `LandingPage.tsx`
*   `/dashboard/:sessionId` -> `Dashboard.tsx`

### Zustand State (`store/modeStore.ts`)
We use Zustand to manage app-wide state that doesn't belong in the URL.
*   `mode` (`'founder' | 'vc' | null`): Tracks whether the user clicked "I'M A FOUNDER" or "I'M A VC". This dictates which variant of the dashboard they see.
*   `selectedFund` (`string`): Only used in VC mode, it tracks which investor persona (e.g., Sequoia, YC) is currently active.

---

## 6. Component Deep Dive: Landing Page

The `LandingPage.tsx` is a vertically scrolling narrative experience composed of multiple stacked sections.

### `Hero.tsx`
The first thing the user sees.
*   Features an animated typewriter effect for the "BLUFFBUSTER" title.
*   Contains the massive "I'M A FOUNDER" and "I'M A VC" retro buttons.
*   Uses custom SVG wave paths fixed to the bottom of the section to visually anchor the title.

### `ProblemSection.tsx`
Explains *why* BluffBuster exists.
*   **Key Feature:** Horizontal scrolling. It pins the vertical scroll and moves a flex container of cards horizontally across the screen using `gsap` and `ScrollTrigger`.

### `HowItWorks.tsx`
A step-by-step technical breakdown.
*   Uses `useScrollProgress` to map vertical scroll percentage to the opacity and translation of various step descriptions.

### `FileUpload.tsx`
The interaction point.
*   Allows users to drag and drop a PDF.
*   Includes a "Run Demo Instance" button that directly navigates to `/dashboard/demo-founder` or `/dashboard/demo-vc` for zero-latency presentations.
*   On real upload, it `POST`s to the FastAPI backend and navigates to the generated `session_id`.

### `ScrollProgress.tsx` & `DashboardScrollSnake.tsx`
*   **ScrollProgress:** Shows a thin red bar at the top of the window representing exactly how far down the user has scrolled. It also includes the background tracking "Pacman" animation that eats symbols.
*   **DashboardScrollSnake:** A variation of the Pacman tracker specifically built for the Dashboard, where a retro Snake grows longer as the user scrolls down the results.

---

## 7. Component Deep Dive: Dashboard (Founder Mode)

When `mode === 'founder'`, the `Dashboard.tsx` orchestrates the rendering of founder-specific widgets.

### The Polling Engine
When the Dashboard mounts, it starts polling the `/api/session/{id}` endpoint.
*   While `status === 'processing'`, it displays a massive animated scanning UI with a spinning loader and cryptic logs.
*   Once `status === 'complete'`, it renders the data.

### `ClaimAutopsy.tsx`
The heart of the analysis. A massive grid mapping every single claim extracted from the deck.
*   **Data Structure:** Renders the `claim_results` array.
*   **Visuals:** Each card applies a `verdict-border-[color]` class based on whether it is VERIFIED, FALSE, or EXAGGERATED.
*   **Hover State:** Uses the `.spotlight-card` radial gradient effect.

### `FirstImpressionAnalyzer.tsx`
Analyzes slides 1-3.
*   Displays a radar-chart style breakdown (Clarity, Hook Strength).
*   **Safety Measure:** Uses optional chaining `(data.rewrites || []).map(...)` to prevent crashes if the LLM hallucinated the output structure.

### `FinancialStressTest.tsx`
Evaluates financial projections.
*   Renders specific `Critical Leakage Detection` flags identifying logically impossible projections.

### `BlindSpotDetector.tsx`
Identifies unmentioned competitors.
*   Simple but effective visual array of competitor names not found in the deck.

### `ClaimRepairFeed.tsx`
Actionable advice.
*   Takes FALSE/EXAGGERATED claims and shows an animated "Before/After" split-screen view with the `repair_suggestion`.
*   Uses Framer Motion to slide the corrected text in over the original text.

---

## 8. Component Deep Dive: Dashboard (VC Mode)

When `mode === 'vc'`, the focus shifts from "fixing" to "destroying."

### `InvestorFingerprint.tsx` & `PersonaSelector.tsx`
*   Allows the VC to select a specific lens (e.g., Tiger Global, Benchmark).
*   The UI dynamically changes its thematic description based on the selected persona's thesis.

### `RedFlagReport.tsx`
The executive summary of doom.
*   Sorts all FALSE and EXAGGERATED claims by a backend-defined `weight` (severity).
*   Renders a massive Risk Score progress bar.

### `CompetitorMap.tsx`
Detailed market intelligence.
*   Renders a grid of known competitors.
*   **Highlight:** A stark red "MISSED BY FOUNDER" tag appears if the LLM determined this competitor should have been in the deck but wasn't.

### `DomainForensics.tsx`
Evaluates team capability.
*   Renders assessments comparing the founder's technical claims against actual industry standards.

---

## 9. Both Modes: Adversarial Debate

### `AdversarialDebate.tsx`
The most complex UI component. It simulates a chat interface between two AI agents reviewing a specific claim.
*   **State:** It tracks the current active claim being debated.
*   **Interface:** Looks like an old hacker terminal or iMessage interface gone rogue.
*   `Defender` (Green) arguing for the founder's intention.
*   `Prosecutor` (Red) striking down the claim with scraped web evidence.
*   **Human in the Loop:** A text input at the bottom allows the user (the Judge) to type an intervention. This calls `api.interveneDebate` and renders the Judge's final ruling.

---

## 10. Custom Hooks

### `useLenis.ts`
Initializes the Lenis smooth scrolling engine. It hooks directly into the Global GSAP Ticker to ensure animations and scrolling are perfectly synced at 60fps without jitter.

### `useScrollProgress.ts`
Creates a GSAP `ScrollTrigger` spanning the entire `document.body`. It continuously updates a React state variable `(0.0 to 1.0)` representing the scroll depth. Used by the Pacman and Snake tracker animations.

### `useTypewriter.ts`
A simple hook for retro text revealed character-by-character. It handles timeouts and cleans up on unmount to prevent memory leaks.

---

## 11. Error Handling & Stability

Given that the backend relies on LLMs returning JSON structure, the frontend *must* anticipate malformed data.

### `DashboardErrorBoundary`
A classic React Class Component wrapped around the dashboard contents.
*   If *any* child component crashes (e.g., calling `.map()` on an `undefined` array), this boundary catches it.
*   Instead of a white screen of death, it renders a styled `RENDER CRASH DETECTED` overlay, keeping the user immersed in the forensic theme while providing a "Return to Base" button.

### Optional Chaining
Throughout the VC and Founder components, strict null checks are enforced:
```tsx
// Prevents complete application failure if the backend omits the flags array
{(data.flags || []).map((flag, i) => ( ... ))}
```

---

## 12. Conclusion

The BluffBuster frontend is built entirely around maximizing the "Wow Moment." By combining heavy, dark aesthetic choices, mathematically smooth scrolling, CSS-driven retro glassmorphism, and a resilient data-rendering layer, it transforms dry JSON analysis into a visceral, cinematic product demo.
