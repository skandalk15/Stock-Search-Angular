# Stock Search App - Angular

This project is a Stock Search application built using Angular. It leverages several technologies such as AJAX, JSON, Bootstrap, MongoDB, Node.js, and the FinnHub Stock API to provide a comprehensive and interactive experience for users. The app is designed to be responsive and user-friendly, with cloud deployment for seamless scalability.

## Table of Contents

1. [Features](#features)
2. [Demo](#demo)
3. [Installation](#installation)
4. [Usage](#usage)
5. [APIs](#apis)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- AJAX and JSON for asynchronous data retrieval
- Angular framework for dynamic and interactive UI
- Bootstrap for responsive design
- Node.js backend with Express framework
- MongoDB for storing user data (watchlist, portfolio)
- Integration with FinnHub API for stock data
- HighCharts for data visualization
- Autocomplete functionality for stock search
- Watchlist and Portfolio management

## Demo

Check out the live demo of the Stock Search App [here](#).

## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/en/download/)
- You have installed [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install)
- You have installed [Angular CLI](https://angular.io/cli)
- You have an account with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database
- You have an API key from [FinnHub](https://finnhub.io/)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/stock-search-app.git
cd stock-search-app
```

2. **Install dependencies**

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add your API keys and database credentials:

```env
FINNHUB_API_KEY=your_finnhub_api_key
MONGODB_URI=your_mongodb_uri
```

4. **Run the development server**

For Angular frontend:
```bash
ng serve
```

For Node.js backend:
```bash
node server.js
```

5. **Open your browser**

Navigate to `http://localhost:4200` to see the application running.

## Usage

1. **Search for stocks**

Use the search bar to enter a stock ticker symbol. The autocomplete functionality will suggest matching stock symbols.

2. **View stock details**

Click on a stock symbol to view detailed information including current price, historical data, news, and recommendations.

3. **Manage Watchlist and Portfolio**

Add stocks to your watchlist or portfolio. Buy and sell stocks directly from the app.

## APIs

### FinnHub API

The app integrates with the FinnHub API for retrieving stock data. Below are some of the key endpoints used:

- **Company Profile:** `https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={API_KEY}`
- **Stock Quote:** `https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}`
- **Autocomplete:** `https://finnhub.io/api/v1/search?q={query}&token={API_KEY}`
- **Company News:** `https://finnhub.io/api/v1/company-news?symbol={symbol}&from={date}&to={date}&token={API_KEY}`
- **Recommendation Trends:** `https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={API_KEY}`

### Polygon.io API

For historical stock data visualization, the app uses the Polygon.io API:

- **Historical Data:** `https://api.polygon.io/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}?adjusted=true&sort=asc&apiKey={API_KEY}`

## Deployment

The application can be deployed on various cloud platforms such as Google Cloud, AWS, or Azure. Below are general steps for deploying on Vercel:

1. **Login to Vercel**

If you don't have an account, sign up for free at [vercel.com](https://vercel.com).

2. **Create a new project**

Click on "New Project" and import the repository from GitHub.

3. **Configure project settings**

Follow the prompts to configure your project settings and environment variables.

4. **Deploy**

Click on "Deploy" and Vercel will automatically build and deploy your project.

## Contributing

Contributions are always welcome! If you have suggestions or improvements, please create a pull request or open an issue.

### Steps to Contribute

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using and contributing to the Stock Search App! If you have any questions or need further assistance, feel free to open an issue or contact us at [your-email@example.com].
