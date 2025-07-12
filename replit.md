# GapFinder - Innovation Gap Analysis Platform

## Overview

GapFinder is a full-stack web application that helps entrepreneurs and innovators identify market gaps and untapped opportunities. The platform uses AI-powered analysis to discover what's missing in various industries and markets, providing detailed insights about feasibility, market potential, and innovation opportunities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom Google-inspired design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with structured error handling
- **External Services**: Google Gemini API for gap analysis using Gemini 2.5 Pro model

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with type-safe database operations
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database schema migrations
- **Production Storage**: PostgreSQL database with Drizzle ORM for persistent data storage

## Key Components

### Database Schema
- **searches**: Stores user search queries and metadata
- **search_results**: Stores AI-generated gap analysis results with detailed metrics
- **Fields**: Innovation scores, market potential, feasibility ratings, market size estimates

### AI Integration
- **Service**: Google Gemini 2.5 Pro for gap analysis
- **Analysis Categories**: "Tech That's Missing", "Services That Don't Exist", "Products Nobody's Made", "Business Models"
- **Scoring System**: 1-10 innovation scores, high/medium/low feasibility and market potential ratings

### UI Components
- **Search Interface**: Google-inspired search bar with real-time feedback
- **Results Display**: Card-based layout with filtering and sorting capabilities
- **Interactive Features**: Save/unsave results, share functionality, export capabilities
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Pages Structure
- **Home**: Main search interface with recent searches
- **Search Results**: Detailed gap analysis results with filtering
- **Saved Results**: User's bookmarked opportunities
- **Search History**: Past searches with result counts

## Data Flow

1. **User Input**: User enters search query through the search interface
2. **API Request**: Frontend sends POST request to `/api/search` endpoint
3. **AI Analysis**: Backend calls OpenAI API to analyze gaps in the query domain
4. **Data Storage**: Search and results are stored in PostgreSQL database
5. **Response**: Frontend receives search ID and navigates to results page
6. **Result Display**: Results are fetched and displayed with interactive features

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-kit` for database operations
- **AI**: `@google/genai` package for Gemini integration
- **Frontend**: React ecosystem with Radix UI components
- **Styling**: Tailwind CSS with PostCSS processing

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Runtime**: tsx for TypeScript execution in development
- **Bundling**: esbuild for production server bundle

## Deployment Strategy

### Development Environment
- **Server**: Development server runs on Node.js with tsx
- **Client**: Vite dev server with hot module replacement
- **Database**: Neon Database with development credentials

### Production Build
- **Client**: Vite builds optimized static assets to `dist/public`
- **Server**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Single Node.js process serving both API and static files

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection
- **AI**: `GEMINI_API_KEY` for Gemini API access
- **Build**: Different configurations for development vs production

### Architecture Decisions

**Database Choice**: PostgreSQL with Drizzle ORM chosen for type safety and relational data structure needed for search results and user interactions.

**AI Integration**: Google Gemini 2.5 Pro selected for its advanced reasoning capabilities in market analysis and gap identification.

**Frontend Framework**: React with TypeScript provides robust component architecture and type safety for complex UI interactions.

**Styling Approach**: Tailwind CSS with Radix UI offers rapid development while maintaining design consistency and accessibility.

**State Management**: TanStack Query chosen for server state management, reducing boilerplate and providing caching, while React hooks handle local UI state.