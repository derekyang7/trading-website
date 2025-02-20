# Trading Website

This project is a web application that displays aggregated stock options data using Node.js, Express, and React. It allows users to search for stock symbols, view stock prices, and download trading data. Users have the option to store and process weekly, daily, or hourly data.

## Motivation

The motivation behind this project is to provide a simple and efficient way to track and analyze stock data. By leveraging modern web technologies, this application aims to offer a user-friendly interface for users to interact with stock data and make informed decisions.

## Use Case

This application is useful for:
- Stock traders who want to track and analyze stock prices.
- Financial analysts who need to download and process trading data.
- Developers who want to learn how to build a full-stack web application using Node.js, Express, and React.

## Quick Start Guide

### Prerequisites

- Node.js and npm installed on your machine.
- Python and Anaconda installed on your machine.
- SQL Server database with the necessary tables (`Symbol`, `Daily`, `Weekly`, `Hourly`, `Option`).

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/trading-website.git
    cd trading-website
    ```

2. Install dependencies for the API:
    ```sh
    cd first-api
    npm install
    ```

3. Install dependencies for the React app:
    ```sh
    cd ../first-app
    npm install
    ```

### Running the Application

1. Start the API server:
    ```sh
    cd first-api
    node index.js
    ```

2. Start the React app:
    ```sh
    cd ../first-app
    npm start
    ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Downloading Trading Data

1. Activate the Anaconda environment and run the Python script to download trading data:
    ```sh
    cd ../trading-data
    ./downloadDaily.bat
    ./downloadHourly.bat
    ./downloadWeekly.bat
    ```

## Local Development Environment Setup

### Setting Up the API

1. Create a `.env` file in the `first-api` directory with the following content:
    ```env
    SERVER=your_sql_server_ip
    USERNAME=your_sql_server_username
    PASSWORD=your_sql_server_password
    DATABASE=trading
    ```

2. Modify the `index.js` file in the `first-api` directory to use the environment variables:
    ```javascript
    // filepath: /Users/derekyang/Repos/trading-website/first-api/index.js
    // ...existing code...
    var connection = {
        "server": process.env.SERVER,
        "authentication": {
            type: "default",
            options: {
                "userName": process.env.USERNAME,
                "password": process.env.PASSWORD,
            }
        },
        options: { "encrypt": true, "database": process.env.DATABASE }
    };
    // ...existing code...
    ```

### Setting Up the React App

1. Create a `.env` file in the `first-app` directory with the following content:
    ```env
    REACT_APP_API_URL=http://localhost:3001
    ```

2. Modify the API calls in the React components to use the environment variable:
    ```javascript
    // filepath: /Users/derekyang/Repos/trading-website/first-app/src/components/YourComponent.js
    // ...existing code...
    fetch(`${process.env.REACT_APP_API_URL}/api/symbol`)
    // ...existing code...
    ```

### Setting Up the Python Environment

1. Create a new Anaconda environment:
    ```sh
    conda create -n trading python=3.8
    conda activate trading
    ```

2. Install the required Python packages:
    ```sh
    pip install numpy pandas yahooquery pyodbc sqlalchemy
    ```

3. Modify the `tradingdatadownload.py` script to use the correct database connection details:
    ```python
    # filepath: /Users/derekyang/Repos/trading-website/trading-data/tradingdatadownload.py
    # ...existing code...
    cnxn = pyodbc.connect("DRIVER={ODBC Driver 17 for SQL Server};SERVER=your_sql_server_ip;UID=your_sql_server_username;PWD=your_sql_server_password;database=trading")
    engine = create_engine("mssql+pyodbc://your_sql_server_username:your_sql_server_password@your_sql_server_ip/trading?driver=ODBC+Driver+17+for+SQL+Server")
    # ...existing code...
    ```

## Learn More

To learn more about the technologies used in this project, check out the following resources:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [Yahoo Query](https://pypi.org/project/yahooquery/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
