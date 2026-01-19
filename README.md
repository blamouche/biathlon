# Biathlon World Cup Tracker 🎿

A modern web application for tracking Biathlon World Cup competitions in real-time with comprehensive race analytics and athlete statistics.

## Features

### Core Functionality
- 📅 **World Cup Calendar** - Browse all World Cup stages and events
- 🏆 **Race Details** - Detailed information for each competition
- ⏰ **Start Lists** - View upcoming race start orders
- 🔴 **Live Results** - Follow ongoing races in real-time with live updates
- 🏁 **Final Results** - Complete race standings and rankings
- 👤 **Athlete Profiles** - Individual athlete statistics and performance history
- 🏆 **World Cup Standings** - Overall, Sprint, Pursuit, Individual, and Mass Start rankings

### Race Analytics
- 📊 **Range Analysis** - Detailed shooting time and range time statistics
- 📈 **Course Analysis** - Lap times, course splits, and ski performance
- ⏱️ **Intermediate Times** - Checkpoint-by-checkpoint race progression
- 🎯 **Shooting Statistics** - Comprehensive shooting performance data

### User Experience
- 🗺️ **Interactive Maps** - Venue locations with Leaflet integration
- 🌍 **Internationalization** - Full English and French language support
- 🎨 **Modern UI** - Elegant, responsive design with dark mode support
- 📱 **Mobile Optimized** - Fully responsive across all devices
- 🔄 **Live Updates** - Real-time data refresh for ongoing competitions
- 🔗 **Share Functionality** - Easy sharing of race results and standings

## Technology Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI component library
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styling

### Internationalization
- **next-intl** - i18n routing and translations

### Maps & Visualization
- **Leaflet** - Interactive maps for venue locations
- **react-leaflet** - React components for Leaflet

### Data Source
- **biathlonresults.com API** - Official biathlon competition data

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd biathlon
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint code quality checks

## Project Structure

```
biathlon/
├── app/                                # Next.js App Router
│   ├── [locale]/                       # Internationalized routes
│   │   ├── page.tsx                    # Home page (World Cup calendar)
│   │   ├── dashboard/                  # Dashboard with statistics
│   │   ├── event/[eventId]/            # Event details and races
│   │   │   └── race/[raceId]/          # Individual race results
│   │   ├── athlete/[ibuId]/            # Athlete profile pages
│   │   ├── standings/[category]/       # World Cup standings by category
│   │   └── debug/                      # Debug tools for development
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Global styles
├── components/                          # React components
│   ├── race/                           # Race-specific components
│   │   ├── RaceTabs.tsx                # Race data tabs
│   │   ├── RangeAnalysisSection.tsx    # Shooting analytics
│   │   ├── CourseAnalysisSection.tsx   # Course performance
│   │   ├── IntermediatesSection.tsx    # Intermediate times
│   │   └── PreTimesSection.tsx         # Pre-race times
│   ├── EventCard.tsx                   # Event display card
│   ├── CompetitionCard.tsx             # Competition card
│   ├── CompetitionList.tsx             # List of competitions
│   ├── WorldCupRankings.tsx            # Standings display
│   ├── BiathlonMap.tsx                 # Interactive venue map
│   ├── LiveBadge.tsx                   # Live race indicator
│   ├── LiveTicker.tsx                  # Live update ticker
│   ├── LanguageSwitcher.tsx            # Language toggle
│   ├── FormattedDateTime.tsx           # Localized date/time
│   └── ...                             # Additional components
├── lib/                                # Core application logic
│   ├── api/
│   │   └── biathlon-api.ts             # API client for biathlonresults.com
│   ├── types/
│   │   └── biathlon.ts                 # TypeScript type definitions
│   ├── utils/                          # Utility functions
│   │   ├── calendar.ts                 # Calendar helpers
│   │   └── dateTime.ts                 # Date/time utilities
│   └── data/
│       └── venues.ts                   # Venue data and coordinates
├── messages/                            # i18n translation files
│   ├── en.json                         # English translations
│   └── fr.json                         # French translations
├── middleware.ts                        # Next.js middleware (i18n routing)
├── i18n.ts                             # i18n configuration
└── public/                             # Static assets
```

## API Integration

The application uses the free API from [biathlonresults.com](https://biathlonresults.com/) to fetch real-time competition data.

### Key Endpoints
- **CUP Data** - World Cup calendar and events
- **Results** - Race results and standings
- **AnalyticResults** - Advanced race analytics (shooting, course, intermediates)

For detailed API integration documentation, see [API_INTEGRATION.md](API_INTEGRATION.md).

### Data Caching
- Event and race data is cached for optimal performance
- Live race results refresh automatically
- 60-second cache for ongoing competitions

## Internationalization

The app supports multiple languages using next-intl:

- **English** (`/en/*`)
- **French** (`/fr/*`)

Language detection is automatic based on browser settings, with manual switching available via the language selector.

## Development

### Debug Tools

Debug pages are available during development:
- `/debug/race/[raceId]` - Raw race data inspection
- `/debug/course-analysis/[raceId]` - Course analytics debugging

### Adding New Features

1. Add new routes in `app/[locale]/`
2. Create reusable components in `components/`
3. Add API methods in `lib/api/biathlon-api.ts`
4. Define types in `lib/types/biathlon.ts`
5. Add translations in `messages/en.json` and `messages/fr.json`

## License

ISC
