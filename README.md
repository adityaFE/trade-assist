# Trade Assist

A modern stock market tracking application that provides real-time stock data, watchlist management, and relevant financial news.

## Features

- Real-time stock price tracking
- Personal watchlist management
- Detailed stock information including:
  - Price changes
  - Market cap
  - Trading volume
  - Historical price data
- Financial news feed with sentiment analysis
- Interactive stock charts
- Multi-symbol stock tracking

## Tech Stack

- React
- TypeScript
- Zustand (State Management)
- Modern UI Components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adityaFE/trade-assist.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000` || `https://trade-assist.netlify.app/`

## Usage

### Viewing Stock Data

Browse through the available stocks on the main dashboard. Each stock card displays:
- Current price
- Daily price change
- Percentage change
- Trading volume
- Market capitalization

### Managing Watchlist

- Add stocks to your watchlist by clicking the "Add to Watchlist" button
- Remove stocks from your watchlist using the "Remove" button
- Track your favorite stocks in one place

### News Feed

Stay updated with the latest market news:
- Real-time financial news updates
- Sentiment analysis for each news item
- Related stock symbols for each news article
- Source attribution and timestamps

## Development

Currently using mock data for development purposes. To integrate with real stock APIs:

1. Replace the mock data in `stockStore.ts` with actual API calls
2. Update the fetch functions to use your preferred stock data provider
3. Add appropriate error handling for API requests

## 🔥 Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web application to your project
4. Enable Authentication (Email/Password and Google Sign-in)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the configuration values
6. Add the following to your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 📦 Deployment

### Frontend Deployment (Netlify)
1. Create a Netlify account
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - Go to Site settings > Build & deploy > Environment variables
   - Add all VITE_* variables from your `.env` file
5. Deploy your site

## 🔒 Security Notes
- Never commit `.env` file to version control
- Keep your API keys and secrets secure
- Use environment variables for all sensitive data
- Regularly update dependencies for security patches

## 🤝 Contributing
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stock data provided by [Your Stock API Provider]
- News data provided by [Your News API Provider]
```
