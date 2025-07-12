# Unbuilt - Innovation Gap Analysis Platform

## Overview

Unbuilt (formerly GapFinder) is a full-stack web application that helps entrepreneurs and innovators identify market gaps and untapped opportunities. The platform uses AI-powered analysis to discover what's missing in various industries and markets, providing detailed insights about feasibility, market potential, and innovation opportunities.

**Strategic Integration Ready**: Built as a standalone platform with architecture designed for future integration with StackFast (AI-powered project planning tool) to create a complete innovation-to-execution ecosystem.

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

## Recent Changes

**July 12, 2025**:
- Switched from OpenAI to Google Gemini 2.5 Pro for AI integration
- Added PostgreSQL database with persistent storage
- Implemented comprehensive Action Plan Modal system
- Built 4-phase development roadmap with interactive progress tracking
- Added resource library and funding strategy guides
- Enhanced platform from gap discovery to complete business development tool
- Architecture designed for future StackFast integration
- **LATEST**: Complete user authentication system with registration and login
- **LATEST**: Professional business website with About, Privacy Policy, and Terms of Service
- **LATEST**: Final rebrand to "Unbuilt" with unbuilt.cloud domain ($3-16/year vs $150 for .tech)
- **LATEST**: Search limits enforcement (Free: 5 searches/month, Pro: unlimited)
- **LATEST**: Production-ready platform foundation for Stripe integration and monetization
- **LATEST**: Enhanced premium features worth $29/month:
  - Action Plan Generator with 4-phase development roadmaps
  - Competitive Analysis with market positioning insights
  - Market Intelligence with demographics and growth opportunities
  - Professional Export System (PDF reports, CSV data, investor pitch decks)
  - AI-Powered Strategic Insights with risk analysis and recommendations
- **LATEST**: Complete premium UI/UX redesign with dark mode and neon effects:
  - Custom animated SVG logo with gradient and glow effects
  - Glass morphism premium cards with hover animations
  - Neon border effects in purple, blue, and cyan
  - Premium search bar with AI-powered suggestions
  - Enhanced typography with gradient text effects
  - Modern tech-forward design justifying $29/month value

## Current Status

**Platform Value**: The application now justifies the $29 Pro subscription with comprehensive business development tools that transform gap discovery into actionable business intelligence.

**Deployment Status**: Successfully deployed on Replit with domain verified at Hostinger. HTTPS configuration in progress for custom domain.

## Next Strategic Priorities

**Revenue Optimization**:
1. **User Onboarding Flow**: Implement guided tour showcasing Pro features value
2. **Free Trial Strategy**: 7-day Pro trial to demonstrate premium value 
3. **Analytics Dashboard**: Track conversion metrics and user engagement
4. **SEO Optimization**: Content marketing to drive organic traffic
5. **Integration Partnerships**: Connect with entrepreneurship communities

**Technical Enhancements**:
1. **Real-time Collaboration**: Team workspace features for Enterprise ($299)
2. **API Access**: Developer tier for integration capabilities
3. **White-label Solutions**: Custom branding for business clients
4. **Advanced AI Features**: GPT-4 integration for deeper insights

## Production Potential Assessment

**User Feedback**: "This crazy idea doesn't seem that crazy at all. If this turns out 1% production apps it's a gold mine"

**Market Validation**: Platform shows strong potential for productization with comprehensive feature set and professional export capabilities.