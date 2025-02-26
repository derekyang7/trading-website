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
- Docker installed for containerization
- Terraform installed for infrastructure provisioning
- Azure CLI installed for Azure deployments

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/derekyang7/trading-website.git
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

### Setting Up the Python Environment

1. Create a new Anaconda environment:
    ```sh
    conda create -n trading python=3.8
    conda activate trading
    ```

2. Install the required Python packages:
    ```sh
    pip install -r trading-data/requirements.txt
    ```

### Running the Application with Docker Compose

1. For local development with Docker:

    ```sh
    docker-compose up --build
    ```
2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Running the Application without Docker Compose (Alternative)

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

1. Activate the Anaconda environment and run the Python script to download trading data. To download daily data, run:
    ```sh
    cd ../trading-data
    ./downloadDaily.bat  # On Windows
    # or
    python tradingdatadownload.py -i daily  # On Unix-based systems
    ```

## Local Development Environment Setup

### Setting Up the Environment

1. Create a `.env` file in the `trading-website` root directory with the following content:
    ```env
    DB_SERVER=your_server
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    DB_DATABASE=your_database
    ```

## Deployment Instructions

### Using Docker and Azure Container Registry

1. Make sure you've created a root `.env` file with your database credentials:
   ```env
   DB_SERVER=your_server
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   ```

2. Login to Azure CLI and create Azure Container Registry (if not already created):
   ```sh
   az login
   az acr create --resource-group myResourceGroup --name tradingwebsiteacr --sku Basic --admin-enabled true
   az acr login --name tradingwebsiteacr
   ```

3. Build Docker images for all components:
   ```sh
   docker build -t tradingwebsiteacr.azurecr.io/trading-data:latest ./trading-data
   docker build -t tradingwebsiteacr.azurecr.io/first-api:latest ./first-api
   docker build -t tradingwebsiteacr.azurecr.io/first-app:latest ./first-app
   ```

4. Push the images to Azure Container Registry:
   ```sh
   docker push tradingwebsiteacr.azurecr.io/trading-data:latest
   docker push tradingwebsiteacr.azurecr.io/first-api:latest
   docker push tradingwebsiteacr.azurecr.io/first-app:latest
   ```

### Using Terraform for Infrastructure as Code

1. Navigate to the terraform directory:
   ```sh
   cd terraform
   ```

2. Initialize Terraform:
   ```sh
   terraform init
   ```

3. Create or update the `terraform.tfvars` file with your database details:
   ```
   db_server = "your_server"
   db_username = "your_username"
   db_password = "your_password"
   db_database = "your_database"
   ```

4. Preview the infrastructure changes:
   ```sh
   terraform plan
   ```

5. Apply the infrastructure changes:
   ```sh
   terraform apply
   ```

6. After successful deployment, retrieve the application URLs:
   ```sh
   terraform output first_app_url
   terraform output first_api_url
   ```

### Automated Deployment

For a fully automated deployment process:

1. Ensure you have all environment variables set up correctly in a .env file at the root of the project.

2. Run the deployment script:
   ```sh
   python deploy.py
   ```

   This script performs the following tasks:
   - Initializes Terraform configuration
   - Creates the resource group and Azure Container Registry
   - Builds and pushes Docker images to ACR
   - Deploys the complete infrastructure using Terraform
   - Outputs the URLs for accessing the deployed application

### Clean Up Resources

To remove all Azure resources when they are no longer needed:
```sh
cd terraform
terraform destroy
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Azure Container Instances](https://azure.microsoft.com/en-us/products/container-instances/)
- [Azure Container Registry](https://azure.microsoft.com/en-us/products/container-registry/)
- [Yahoo Query](https://pypi.org/project/yahooquery/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
