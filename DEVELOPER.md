# Developer Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Development Setup](#development-setup)
3. [Code Structure](#code-structure)
4. [Key Components](#key-components)
5. [API Reference](#api-reference)
6. [Testing](#testing)
7. [Performance](#performance)
8. [Deployment](#deployment)
9. [Contributing](#contributing)

## Architecture Overview

The SmartAccessible CMS Toolkit is built as a monorepo with three main packages:

### Packages

- **`packages/web`**: Next.js application for the web-based CMS
- **`packages/mobile`**: Expo React Native application for mobile content management
- **`packages/cli`**: Node.js CLI tool for automation and administrative tasks

### Technology Stack

#### Frontend
- **React 18** with TypeScript
- **Next.js 14** for web application
- **Expo** for mobile development
- **Bootstrap 5** for UI components
- **Tailwind CSS** for utility classes
- **React DnD** for drag-and-drop functionality
- **TipTap** for rich text editing

#### Backend & Data
- **Prisma** ORM with SQLite (development) / PostgreSQL (production)
- **Next.js API Routes** for serverless functions
- **js-cookie** for client-side cookie management

#### AI & External Services
- **OpenAI GPT-4** for content generation and analysis
- **Computer Vision APIs** for image analysis
- **Storyblok** for headless CMS integration

#### Development & Quality
- **Jest** for unit testing
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 8+ or yarn
- Git
- Expo CLI (for mobile development)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd smartaccessible-cms-toolkit
   npm install
   ```

2. **Setup web application:**
   ```bash
   cd packages/web
   npm install
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run dev
   ```

3. **Setup mobile application:**
   ```bash
   cd packages/mobile
   npm install
   npm start
   ```

4. **Setup CLI:**
   ```bash
   cd packages/cli
   npm install
   npm run build
   ```

### Environment Variables

Create `.env.local` files in each package with necessary configuration:

#### Web Package (.env.local)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
STORYBLOK_ACCESS_TOKEN="your-storyblok-token"
OPENAI_API_KEY="your-openai-key"
```

#### Mobile Package (.env)
```env
EXPO_PUBLIC_API_URL="http://localhost:3000/api"
EXPO_PUBLIC_STORYBLOK_TOKEN="your-storyblok-token"
```

## Code Structure

### Web Package Structure

```
packages/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── content-editor/    # Content editor pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── ...
│   ├── components/            # React components
│   │   ├── content-editor/    # Editor-specific components
│   │   ├── icons/            # Icon components
│   │   └── ...
│   ├── contexts/             # React contexts
│   ├── lib/                  # Utility libraries
│   │   ├── db/              # Database utilities
│   │   ├── telemetry.ts     # Analytics & monitoring
│   │   └── ...
│   └── types/               # TypeScript type definitions
├── prisma/                   # Database schema
├── jest.config.js           # Jest configuration
└── tailwind.config.js       # Tailwind configuration
```

### Key Directories

- **`src/app/`**: Next.js 13+ App Router pages and API routes
- **`src/components/`**: Reusable React components
- **`src/contexts/`**: React Context providers for global state
- **`src/lib/`**: Utility functions, database connections, external API clients
- **`prisma/`**: Database schema and migrations

## Key Components

### Content Editor

The content editor is the core component for content creation and editing.

#### BlockEditorCanvas
- **Location**: `src/components/content-editor/BlockEditorCanvas.tsx`
- **Purpose**: Main canvas for drag-and-drop block editing
- **Features**:
  - Drag and drop block reordering
  - Inline editing with TipTap
  - Block duplication and deletion
  - Real-time content saving to IndexedDB

#### EditorToolbar
- **Location**: `src/components/content-editor/EditorToolbar.tsx`
- **Purpose**: Main toolbar with save, publish, and panel toggle buttons
- **Features**:
  - Save/Publish actions
  - AI panel toggle
  - Accessibility score display
  - Undo/Redo integration

### AI Integration

#### AIPanel
- **Location**: `src/components/content-editor/AIPanel.tsx`
- **Purpose**: AI suggestions and accessibility dashboard
- **Features**:
  - Tabbed interface for different AI features
  - Real-time scan status
  - Responsive design for mobile/tablet

#### AISuggestionsPanel
- **Location**: `src/components/content-editor/AISuggestionsPanel.tsx`
- **Purpose**: Display and apply AI-generated suggestions
- **Features**:
  - Suggestion listing with apply/dismiss actions
  - Real-time updates via WebSocket

### Media Management

#### MediaLibrary
- **Location**: `src/components/content-editor/MediaLibrary.tsx`
- **Purpose**: Media asset management interface
- **Features**:
  - File upload with drag-and-drop
  - AI alt-text generation
  - Image editing integration

#### ImageEditor
- **Location**: `src/components/content-editor/ImageEditor.tsx`
- **Purpose**: Built-in image editing modal
- **Features**:
  - Crop, resize, rotate operations
  - Quality optimization
  - Canvas-based editing with real-time preview

### Performance Monitoring

#### PerformanceMonitor
- **Location**: `src/components/PerformanceMonitor.tsx`
- **Purpose**: Real-time performance tracking and alerts
- **Features**:
  - Core Web Vitals monitoring
  - Performance budget alerts
  - Optimization recommendations

## API Reference

### Content API

#### GET /api/content
Retrieve content blocks.

**Query Parameters:**
- `id` (optional): Specific content block ID

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### POST /api/content
Create new content block.

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "authorId": "string"
}
```

#### PUT /api/content
Update existing content block.

**Query Parameters:**
- `id`: Content block ID (required)

### AI API

#### POST /api/ai/scan
Trigger AI analysis on content.

**Request Body:**
```json
{
  "workspace_id": "string",
  "content_snapshot": "string",
  "scan_types": ["readability", "accessibility", "seo"]
}
```

**Response:**
```json
{
  "task_id": "string",
  "status": "done|running|failed",
  "results": {
    "suggestions": [...]
  }
}
```

#### GET /api/ai/scan
Get AI scan results.

**Query Parameters:**
- `taskId`: Task ID from scan request

### Media API

#### POST /api/media/upload
Upload media file.

**Request:** Multipart form data with file

**Response:**
```json
{
  "cdn_url": "string",
  "id": "string",
  "alt_text": "string"
}
```

## Testing

### Test Structure

Tests are organized alongside source files:

```
src/
├── components/
│   ├── Component.tsx
│   └── __tests__/
│       └── Component.test.tsx
└── lib/
    ├── utils.ts
    └── __tests__/
        └── utils.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage Goals

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Testing Libraries

- **Jest**: Test runner and assertion library
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: DOM assertions
- **@testing-library/user-event**: User interaction simulation

### Test Categories

1. **Unit Tests**: Individual function/component testing
2. **Integration Tests**: Component interaction testing
3. **API Tests**: Endpoint testing with mocks
4. **E2E Tests**: Full user workflow testing (future)

## Performance

### Performance Budgets

The application defines performance budgets to ensure optimal user experience:

```javascript
const PERFORMANCE_BUDGETS = [
  { metric: 'FCP', threshold: 1800, unit: 'ms' },
  { metric: 'LCP', threshold: 2500, unit: 'ms' },
  { metric: 'FID', threshold: 100, unit: 'ms' },
  { metric: 'CLS', threshold: 0.1, unit: 'count' },
  { metric: 'TTFB', threshold: 800, unit: 'ms' },
  { metric: 'bundle-size', threshold: 500000, unit: 'bytes' }
];
```

### Optimization Techniques

1. **Code Splitting**: Dynamic imports for route-based splitting
2. **Image Optimization**: Next.js Image component with automatic optimization
3. **Bundle Analysis**: Webpack bundle analyzer for size monitoring
4. **Caching**: Aggressive caching strategies for static assets
5. **Lazy Loading**: Component and image lazy loading

### Monitoring

Performance is monitored through:

- **Real-time Metrics**: Core Web Vitals tracking
- **Alert System**: Budget violation notifications
- **Telemetry**: Anonymous usage analytics
- **Error Boundaries**: Graceful error handling

## Deployment

### Web Application

**Vercel Deployment:**
```bash
npm install -g vercel
vercel --prod
```

**Environment Variables:**
- Set production database URL
- Configure API keys for external services
- Set up monitoring and analytics keys

### Mobile Application

**Expo Build:**
```bash
expo build:ios
expo build:android
```

**App Store Deployment:**
- Configure app metadata
- Set up code signing certificates
- Submit through App Store Connect

### CLI Tool

**NPM Publishing:**
```bash
npm version patch
npm publish
```

## Contributing

### Development Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes:**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation

3. **Run Quality Checks:**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Submit Pull Request:**
   - Provide clear description
   - Reference related issues
   - Request review from maintainers

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb config with React rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

### Pull Request Process

1. **Title**: Clear, descriptive title
2. **Description**: Detailed explanation of changes
3. **Testing**: How changes were tested
4. **Screenshots**: UI changes with before/after
5. **Breaking Changes**: Document any breaking changes

### Code Review Checklist

- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Performance impact assessed
- [ ] Accessibility requirements met
- [ ] Security implications reviewed

## Troubleshooting

### Common Issues

1. **Database Connection Issues:**
   ```bash
   npx prisma migrate reset
   npx prisma db push
   ```

2. **Build Failures:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Test Failures:**
   ```bash
   npm run test:coverage
   # Check coverage reports for gaps
   ```

4. **Performance Issues:**
   - Check Performance Monitor component
   - Review bundle analyzer output
   - Optimize images and code splitting

### Getting Help

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Documentation**: Check this developer guide first
- **Community**: Join our Discord/Slack community

## Security

### Best Practices

- **Input Validation**: All user inputs validated
- **Authentication**: JWT tokens with secure storage
- **Authorization**: Role-based access control
- **Data Sanitization**: XSS prevention
- **API Security**: Rate limiting and CORS
- **Secrets Management**: Environment variables for sensitive data

### Reporting Security Issues

Email security@company.com with details. Do not create public issues for security vulnerabilities.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.