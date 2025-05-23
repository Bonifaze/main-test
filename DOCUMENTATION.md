# Wikidata Activity Tracker Documentation

## Overview
The Wikidata Activity Tracker is a React-based web application that allows users to track and analyze edits made on Wikidata. It provides both single-user and bulk-user tracking capabilities with detailed analytics and visualization features.

## Features

### User Tracking
- **Single User Tracking**
  - Track edits by a specific Wikidata user
  - Filter edits by date range
  - Filter by property types (labels, descriptions, aliases, statements, etc.)
  - View detailed edit history with sorting capabilities
  - Export results in various formats

- **Bulk User Tracking**
  - Upload CSV/TXT files containing multiple usernames
  - Compare edit statistics across multiple users
  - View top contributors by various metrics
  - Analyze property distribution across users

### Analytics
- **Single User Analytics**
  - Total edit count
  - Added/Removed/Unchanged edit distribution
  - Bytes added/removed
  - Property-wise breakdown
  - Visual charts for edit distribution

- **Bulk User Analytics**
  - Top contributors by total edits
  - Top contributors by bytes added
  - Property distribution across users
  - Comparative statistics table

### Data Visualization
- Bar charts for edit distribution
- Pie charts for property distribution
- Interactive tables with sorting capabilities
- Color-coded size changes and statistics

## Technical Architecture

### Components
- **Common Components**
  - `PageHeader`: Consistent page header with title and description
  - `Card`: Reusable card container
  - `Input`: Form input component
  - `Button`: Action button component
  - `DateRangePicker`: Date range selection component
  - `CheckboxGroup`: Multiple selection component
  - `Table`: Sortable data table component

### Services
- **API Service (`api.ts`)**
  - `getUserEdits`: Fetch edits for a single user
  - `getBulkUserEdits`: Fetch and analyze edits for multiple users
  - `getEntityEdits`: Fetch edits for a specific entity
  - `getEntityDetails`: Fetch entity details
  - `getRecentChanges`: Fetch recent changes
  - `exportData`: Export data in various formats

### Context
- **TrackedHistoryContext**: Manages tracking history and recent searches

## Usage

### Single User Tracking
1. Select "Single User" mode
2. Enter the Wikidata username
3. Set date range
4. Select properties to track
5. Set result limit
6. Click "Search"

### Bulk User Tracking
1. Select "Bulk Users" mode
2. Upload a CSV/TXT file with usernames (one per line)
3. Set date range
4. Select properties to track
5. Set result limit
6. Results will be processed automatically

### Exporting Data
- Click the export button to save results in various formats
- Available formats: JSON, CSV, PDF

## Technical Requirements
- React 18+
- TypeScript
- Chart.js for visualizations
- Tailwind CSS for styling
- Vite for build tooling

## Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## File Structure
```
src/
├── components/
│   └── common/
│       ├── PageHeader.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Button.tsx
│       ├── DateRangePicker.tsx
│       ├── CheckboxGroup.tsx
│       └── Table.tsx
├── pages/
│   ├── UserTracker.tsx
│   └── Analytics.tsx
├── services/
│   └── api.ts
├── context/
│   └── TrackedHistoryContext.tsx
└── App.tsx
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
[Add license information here] 