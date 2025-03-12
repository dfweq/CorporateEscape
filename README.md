# EXIT_NODE - Tech Worker Liberation Platform

![version](https://img.shields.io/badge/version-0.1.0-red)
![license](https://img.shields.io/badge/license-MIT-green)

## Overview

**EXIT_NODE** is a gritty, cyberpunk-styled social platform designed for tech workers to track and share their corporate exodus journey. The platform emphasizes anti-corporate sentiment through a stark visual design inspired by terminal UIs and focuses on tracking burnout metrics and departure statistics across major tech companies.

## Key Features

- **Company Selection Dashboard**: Direct access to FAANG (and other major tech) company data without requiring authentication
- **Burnout Metrics**: Track and compare burnout scores across companies
- **Departure Statistics**: Visualize employee exodus patterns and trends
- **Network Activity**: Anonymous sharing of corporate exodus experiences
- **Terminal-Style UI**: Cyberpunk aesthetic with glitch effects and minimal design

## Tech Stack

- **Frontend**: React with Vite & TailwindCSS
- **Backend**: Express.js
- **Storage**: In-memory database
- **State Management**: React Query & Context API
- **Styling**: Custom Cyberpunk theme using ShadCN components

## Color Scheme

The application uses a carefully selected cyberpunk color palette:

- **Primary**: `#FF0033` (Resistance Red)
- **Background**: `#000000` (Void Black)
- **Terminal**: `#00FF00` (Matrix Green)
- **Text**: `#FFFFFF` (Stark White)
- **Secondary Background**: `#121212` (Deep Space)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:5000`

## Project Structure

```
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # UI components 
│   │   ├── context/      # React Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Main application pages
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
├── server/               # Backend code
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API routes
│   ├── storage.ts        # In-memory database
│   └── vite.ts           # Vite server integration
└── shared/               # Shared code
    └── schema.ts         # Data models
```

## Design Philosophy

EXIT_NODE's design is inspired by hacker aesthetics, terminal UIs, and the cyberpunk genre. The interface features:

- Sharp edges with minimal padding
- Monospaced fonts (Fira Code/Space Mono)
- Terminal-style interfaces with simulated typing
- Glitch effects and scan lines
- High contrast color combinations

The design is intentionally gritty and anti-corporate, aiming to create a digital safe haven for tech workers contemplating their exodus from major tech corporations.

## License

MIT License, 2025