# trading-data/Dockerfile
FROM ubuntu:20.04

WORKDIR /usr/src/app

COPY . .

# Install the ODBC Driver 18 for SQL Server with additional dependencies
RUN apt-get update && \
    apt-get install -y curl apt-transport-https gnupg2 lsb-release && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y python3 python3-pip \
    && pip3 install --no-cache-dir -r requirements.txt \
    && rm -rf /var/lib/apt/lists/*

CMD ["python3", "tradingdatadownload.py", "-i", "daily"]
