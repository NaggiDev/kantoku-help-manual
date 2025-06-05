# Kantoku Help Manual - Project Plan & PRD

## 1. Introduction

This document outlines the plan and requirements for building a static help manual for Kantoku. The manual will consist of multiple web pages, providing users with comprehensive instructions and guidance. The chosen tech stack is Next.js with Tailwind CSS for a lightweight, efficient, and easily deployable solution.

## 2. Goals

*   Provide clear, concise, and easy-to-navigate documentation for Kantoku users.
*   Create a fast-loading, responsive, and statically generated website.
*   Establish a maintainable and scalable content structure.
*   Ensure the design aligns with the provided Figma mockups.

## 3. Target Audience

*   New users of Kantoku seeking onboarding and basic instructions.
*   Existing users looking for detailed information on specific features or troubleshooting.

## 4. Tech Stack

*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **Content:** Markdown files
*   **Deployment:** Static site hosting (e.g., Vercel, Netlify, GitHub Pages)
*   **Version Control:** Git & GitHub

## 5. Project Structure (as previously defined)

```
kantoku-help-manual/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (docs)/
│   │   │   ├── [category]/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── Article/
│   │   │   ├── ArticleHeader.tsx
│   │   │   └── ArticleBody.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       └── SearchBar.tsx
│   ├── content/ # Markdown files for help articles
│   │   ├── category1/
│   │   │   ├── article1.md
│   │   │   └── article2.md
│   │   └── category2/
│   │       └── article3.md
│   └── lib/
│       └── markdownProcessor.ts
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 6. Figma Design Implementation Plan

*   **Analyze Figma:** Thoroughly review the Figma design ([https://www.figma.com/design/Ah31XRzwoFkH16vPoO06KE/Kantok-final?node-id=5261-220348](https://www.figma.com/design/Ah31XRzwoFkH16vPoO06KE/Kantok-final?node-id=5261-220348)) to identify:
    *   Reusable components (buttons, cards, navigation elements, etc.).
    *   Page layouts (homepage, article page, category page).
    *   Typography (font families, sizes, weights).
    *   Color palette.
    *   Spacing and grid systems.
*   **Component Mapping:** Map Figma components to React components within the `src/components/` directory.
*   **Styling:** Implement styling using Tailwind CSS, creating custom configurations if necessary to match the design precisely.
*   **Image Assets:** Extract and optimize image assets from Figma and place them in `public/images/`.

## 7. Content Strategy

*   **Content Source:** Initially, content will be based on the structure implied by the Figma artboards. Placeholder content might be used where final text is not yet available.
*   **Markdown:** All help articles will be written in Markdown for ease of writing and maintenance.
*   **Organization:**
    *   Content will be organized into categories and sub-articles (e.g., `getting-started/installation`, `features/feature-x`).
    *   The `src/content/` directory will mirror this structure.
*   **Metadata:** Each Markdown file might include frontmatter (e.g., title, description, order) for better organization and SEO.

## 8. Core Features & Pages

*   **Homepage (`src/app/page.tsx`):**
    *   Introduction to the help manual.
    *   Search bar (initially a static placeholder, can be made functional later).
    *   Links to main categories or popular articles.
*   **Documentation Layout (`src/app/(docs)/layout.tsx`):**
    *   **Persistent Sidebar:** Navigational links to all categories and articles. Should be collapsible on smaller screens.
    *   **Top Navbar:** Branding, main site links (if any), search bar.
    *   **Content Area:** Where the article content is displayed.
*   **Article Page (`src/app/(docs)/[category]/[slug]/page.tsx`):**
    *   Displays the content of a single help article parsed from a Markdown file.
    *   Breadcrumbs for navigation.
    *   Potentially "Last Updated" information.
    *   Next/Previous article links.
*   **Search Functionality (Future Enhancement):**
    *   Client-side search of article titles and content.
    *   Server-side search for larger documentation sets.

## 9. Development Steps (Phase 1 - Initial Setup & Core Structure)

1.  **Initialize GitHub Repository:** (Attempt again) Create `kantoku-help-manual` repository on GitHub.
2.  **Project Setup:**
    *   Initialize Next.js project: `npx create-next-app@latest kantoku-help-manual --typescript --tailwind --eslint --app`
    *   Clean up default Next.js boilerplate.
    *   Install any additional necessary dependencies (e.g., `gray-matter` for Markdown frontmatter, `remark` and `remark-html` for Markdown parsing).
3.  **Basic Layout & Navigation:**
    *   Implement the root layout (`src/app/layout.tsx`).
    *   Implement the documentation layout (`src/app/(docs)/layout.tsx`) with a placeholder sidebar and navbar.
    *   Create a basic homepage (`src/app/page.tsx`).
4.  **Markdown Processing:**
    *   Develop utility functions in `src/lib/markdownProcessor.ts` to:
        *   Read Markdown files from the `src/content/` directory.
        *   Parse frontmatter.
        *   Convert Markdown to HTML.
        *   Generate a list of available articles for the sidebar.
5.  **Dynamic Article Pages:**
    *   Implement `src/app/(docs)/[category]/[slug]/page.tsx` to dynamically render articles based on the URL.
    *   Populate the sidebar with links to articles.
6.  **Styling Core Components:**
    *   Style basic HTML elements (headings, paragraphs, lists, code blocks) using Tailwind CSS in `globals.css` or a base component.
    *   Start implementing core components identified from Figma (e.g., `Navbar.tsx`, `Sidebar.tsx`).
7.  **Create Initial Content:**
    *   Create a few sample Markdown files in `src/content/` (e.g., `getting-started/introduction.md`, `getting-started/setup.md`).
8.  **First Commit & Push:** Push the initial project structure and basic functionality to GitHub.

## 10. Subsequent Phases

*   **Phase 2: Figma Component Implementation:**
    *   Systematically build out React components based on the Figma designs.
    *   Refine styling to match Figma pixel-perfectly.
    *   Ensure responsiveness across devices.
*   **Phase 3: Content Population & Refinement:**
    *   Write and organize all help content in Markdown.
    *   Add images and other media.
    *   Review and edit content for clarity and accuracy.
*   **Phase 4: Advanced Features (Optional/Future):**
    *   Implement search functionality.
    *   Add internationalization (i18n) if needed.
    *   Integrate analytics.
    *   Set up a CI/CD pipeline for deployment.
*   **Phase 5: Testing & Deployment:**
    *   Thoroughly test on different browsers and devices.
    *   Deploy to a static hosting provider.

## 11. Non-Goals (for initial version)

*   User authentication or accounts.
*   Dynamic, server-side content generation beyond Markdown processing.
*   Complex backend integrations.
*   Interactive tutorials (unless simple and achievable with static content).

## 12. Open Questions/Considerations

*   Final source and structure of all help content.
*   Specific requirements for search functionality (if implemented).
*   Branding guidelines (logos, specific fonts not in standard Tailwind).

This plan provides a roadmap. We will iterate and refine as the project progresses. 