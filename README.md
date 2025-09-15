# SmartAccessible CMS Toolkit

## Project Overview

The **SmartAccessible CMS Toolkit** is an ultimate AI-powered CMS toolkit designed to integrate seamlessly with Storyblok. It focuses on enhancing accessibility, inclusivity, and personalization, while also providing advanced features for creative content generation, live preview across web and mobile platforms, multi-role management, and CLI automation. The toolkit ensures real-time synchronization, robust analytics, comprehensive monitoring, and advanced SEO capabilities. It includes sophisticated media handling, undo/redo functionality, version control, and streamlined CI/CD pipelines. Furthermore, it supports extensive localization, device simulation, flexible theming, and optimizes the overall developer workflow through full system orchestration.

## Key Features

*   **AI-Powered Content Generation:** Leverage AI for creative content generation, accessibility, inclusivity, and personalization.
*   **Live Preview:** Real-time content preview for both web and mobile.
*   **Multi-Role Management:** Granular control over user roles and permissions.
*   **CLI Automation:** Command-line interface for common tasks like content migration and accessibility audits.
*   **Real-time Synchronization:** WebSocket and Storyblok Bridge for instant updates.
*   **Comprehensive Analytics & Monitoring:** Track key performance indicators and system health.
*   **Advanced SEO & Media Handling:** Tools for optimizing content for search engines and efficient media management.
*   **Undo/Redo & Version Control:** Robust mechanisms for content history and recovery.
*   **CI/CD Integration:** Automated pipelines for seamless deployment.
*   **Localization:** Support for multiple languages (`en`, `fr`, `es`, `de`, `zh`, `ar`, `ru`, `pt`, `hi`, `ja`, `ko`, `it`, `nl`).
*   **Accessibility Features:** WCAG 2.1 compliance, ARIA labels, contrast checking, keyboard navigation, screen reader testing, color blind modes, dynamic font scaling, alt text enforcement, semantic HTML, and auto-fix suggestions.
*   **Theming:** Multiple themes including `light`, `dark`, `high-contrast`, `sepia`, and `solarized`.

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Git
*   Expo CLI (for mobile development)
*   Prisma (for database management in web app)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kawacukennedy/smartaccessible_cms_toolkit.git
    cd smartaccessible_cms_toolkit
    ```

2.  **Install root dependencies (Monorepo setup):**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Install web app dependencies:**

    ```bash
    cd packages/web
    npm install
    # or yarn install
    cd ../..
    ```

4.  **Install mobile app dependencies:**

    ```bash
    cd packages/mobile
    npm install
    # or yarn install
    cd ../..
    ```

5.  **Install CLI dependencies:**

    ```bash
    cd packages/cli
    npm install
    # or yarn install
    cd ../..
    ```

### Database Setup (for Web App)

Navigate to `packages/web` and run Prisma migrations:

```bash
cd packages/web
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
```

## Usage

### Web Application

To run the Next.js web application:

```bash
cd packages/web
npm run dev
# or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mobile Application

To run the Expo mobile application:

```bash
cd packages/mobile
npm start
# or yarn start
```

Follow the instructions in your terminal to open the app on a simulator or physical device.

### CLI Tool

To use the CLI tool, navigate to the `packages/cli` directory and run the commands:

```bash
cd packages/cli

# Build the CLI tool
npm run build

# Example: Migrate content
npm start migrate-content -- --source-space your-source-space-id --destination-space your-destination-space-id

# Example: Audit accessibility
npm start audit-accessibility -- --space your-space-id --output-file report.json

# Example: Generate suggestions
npm start generate-suggestions -- --space your-space-id
```

## Architecture

This project is structured as a monorepo, containing three main packages:

*   `packages/web`: A Next.js application serving the web-based CMS interface.
*   `packages/mobile`: An Expo application for mobile content management.
*   `packages/cli`: A command-line interface tool for automation and administrative tasks.

Key technologies include:

*   **Frontend:** React, Next.js, Expo, Bootstrap, i18next
*   **Backend (implied):** Prisma (ORM), likely Node.js/TypeScript for API endpoints.
*   **Database:** SQLite (for development, configurable for production).
*   **AI Integration:** GPT-4 NLP, Computer Vision API, Custom Ensemble AI, Sentiment Analysis API.
*   **Real-time Sync:** WebSockets, Storyblok Bridge.

## AI Integration

The toolkit integrates various AI models to enhance content creation and management:

*   **GPT-4 NLP:** For accessibility, inclusivity, personalization, and creative content generation.
*   **Computer Vision API:** Analyzes images for alt-text, contrast, and layout issues.
*   **Custom Ensemble AI:** Combines NLP and CV for advanced suggestions and predictive analytics.
*   **Sentiment Analysis API:** Evaluates content tone and predicts engagement.

AI features are triggered by content updates, CLI commands, webhooks, scheduled scans, and manual UI actions.

## Real-time Synchronization

Real-time updates are powered by WebSockets and the Storyblok Bridge, ensuring immediate reflection of changes across all platforms. It handles content updates, AI suggestion updates, variation publishing, user activity, and more, with robust retry strategies and conflict resolution.

## Deployment

*   **Web:** Deployed on Vercel with CI/CD pipelines for linting, testing, building, deploying, and monitoring.
*   **Mobile:** Deployed via Expo to App Store and Google Play, with CI/CD for building and testing.
*   **Backend:** Designed for serverless deployment (e.g., AWS Lambda or Vercel Serverless).
*   **CLI:** Distributed as an npm package with semantic versioning and CI/CD for publishing.

## Contributing

Contributions are welcome! Please refer to the project's issue tracker for open tasks or submit pull requests with your enhancements.

## License

This project is licensed under the ISC License.
