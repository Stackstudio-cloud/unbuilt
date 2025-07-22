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

**July 21, 2025**:
- **MIGRATION COMPLETE**: Successfully migrated from Replit Agent to native Replit environment
- **NEW THEME**: Implemented "Neon Flame" theme with purple/red/orange/white color scheme
  - Native dark mode as default for optimal neon flame aesthetics
  - Custom CSS classes: flame-text, flame-glow, btn-flame, neon-flame-border
  - **DESIGN DIRECTION**: "Massive black hole" aesthetic approved by user - creates mysterious, intriguing vibe perfect for discovering what doesn't exist yet
  - Ultra-dark gradient backgrounds with high color opacity for dramatic contrast
  - Flame gradient backgrounds optimized for laptop viewing
  - **THEME CONSISTENCY**: Comic-style text fields with white text shadows on dark backgrounds
  - **TEXT VISIBILITY**: Global CSS enforcement prevents dark text on dark backgrounds
  - **COMPONENT SYSTEM**: ThemeEnforcer components for future page consistency
- **LOGO UPDATE**: Created custom transparent SVG logo with flame theme
  - Solved black background transparency issues with native SVG approach
  - Clean, professional logo without animations or glow effects
  - Flame-themed colors (purple, pink, red, orange) with construction elements
  - Larger logo sizes across all components (sm=12x12, md=16x16, lg=20x20, xl=24x24)
- **SIMPLIFIED AUTHENTICATION**: Replaced complex OAuth with clean demo mode
  - Removed dependency hell from Passport.js, OpenID, and OAuth providers
  - Created simple authentication system that works instantly with zero configuration
  - Demo user automatically created for immediate testing and development
  - Clean fallback that can be easily upgraded to real auth later
  - Fixed database schema mismatches and column type conflicts
- **ARCHITECTURE**: Made external services (SendGrid, Gemini, OAuth) optional for development
  - App now starts without API keys (uses demo data or shows helpful error messages)
  - Secure development environment with graceful degradation
  - PostgreSQL database provisioned and configured
  - Health check endpoint added at /health for proper Replit deployment detection
- **DEPLOYMENT SUCCESS**: Application now running successfully in production
  - Fixed all database schema conflicts and type mismatches
  - Server startup optimized for Replit environment
  - **LATEST**: Successfully deployed and accessible via custom domain
  - GitHub repository integration working at https://github.com/Stackstudio-cloud/unbuilt.Cloud

## Current Status

**Platform Value**: The application now justifies the $29 Pro subscription with comprehensive business development tools that transform gap discovery into actionable business intelligence.

**Deployment Status**: Successfully deployed on Replit with domain verified at Hostinger. HTTPS configuration in progress for custom domain.

## GitHub Repository Status

**Repository Preparation**: Complete and ready for GitHub deployment
- ✅ Professional README.md with comprehensive documentation
- ✅ MIT License and proper .gitignore configuration  
- ✅ Environment template (.env.example) and setup instructions
- ✅ Documentation folder with features guide and setup instructions
- ✅ Demo placeholder (SVG) ready for replacement with actual GIF
- ✅ GITHUB_SETUP.md with step-by-step deployment instructions
- ✅ Project structure optimized for open-source sharing

**Ready for Git Commands**:
```bash
git init
git add .
git commit -m "Initial commit: Unbuilt - Innovation Gap Analysis Platform"
git remote add origin https://github.com/username/unbuilt.git
git push -u origin main
```

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