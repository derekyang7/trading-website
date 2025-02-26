import numpy
import pandas as pd
import json
#https://pypi.org/project/yahooquery
from yahooquery import Ticker
import datetime
import pyodbc
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
import sys, getopt
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
db_server = os.getenv('DB_SERVER')
db_username = os.getenv('DB_USERNAME')
db_password = os.getenv('DB_PASSWORD')
db_database = os.getenv('DB_DATABASE')

def saveToTable(df, tableName, cnxn, engine):
    """
    Save a DataFrame to a specified SQL table.

    This function removes all existing data from the specified database table
    and then appends the data from the given DataFrame to the table.

    Parameters:
    df (pandas.DataFrame): The DataFrame containing the data to be saved.
    tableName (str): The name of the table in the database.
    cnxn (pyodbc.Connection): The connection object to the database.
    engine (sqlalchemy.engine.Engine): The SQLAlchemy engine object for the database.

    Returns:
    None
    """

    # remove all existing data from database table
    cursor = cnxn.cursor()
    cursor.execute('delete ' + tableName)
    cursor.commit()
    cursor.close()

    df.to_sql(tableName, engine, if_exists='append', schema='dbo', index=True)

def downloadDaily(ticker_symbols, cnxn, engine):
    """
    Downloads daily trading data and option chains for a list of ticker symbols and stores them in a database.
    Parameters:
    ticker_symbols (list): A list of ticker symbols to download data for.
    cnxn (pyodbc.Connection): A connection object to the database.
    engine (sqlalchemy.engine.Engine): An SQLAlchemy engine object to interact with the database.
    The function performs the following steps:
    1. Executes a stored procedure 'spProcessDailyData' to process daily data.
    2. For each ticker symbol in the list:
        a. Downloads daily trading data for the past year with a daily interval.
        b. Adds the symbol and date as indexes to the data.
        c. Saves the daily trading data to a temporary table 'tmpDaily' in the database.
        d. Downloads the option chain data for the ticker symbol.
        e. If the option chain data is not a string, adds a creation date and saves it to the 'Option' table in the database.
    3. Executes the stored procedure 'spProcessDailyData' again to process the newly downloaded data.
    """


    cursor = cnxn.cursor()
    cursor.execute('EXEC spProcessDailyData')
    cursor.commit()
    cursor.close()

    for symbol in ticker_symbols:
        ticker = Ticker(symbol)
        daily = ticker.history(period='1y', interval='1d')
        print(f'Downloading {symbol}.')

        daily.to_sql('tmpDaily', engine, if_exists='append',schema='dbo', index=True)

        # df_options = ticker.option_chain

        #check if it's string, if yes, there is no option chain

        # if isinstance(df_options, str) == False:
        #     print(f'Downloading option chain {symbol}.')
        #     df_options['createDate'] = datetime.date.today()
        #     df_options.to_sql('Option', engine, if_exists='append',schema='dbo', index=True)

    cursor = cnxn.cursor()
    cursor.execute('EXEC spProcessDailyData')
    cursor.commit()
    cursor.close()


def main(argv):
    """
    Main function to download trading data based on the specified interval.

    Args:
        argv (list): List of command-line arguments.

    Command-line Arguments:
        -i, --interval: Specifies the interval for downloading trading data.
                        Possible values are 'weekly', 'daily', and 'hourly'.

    Raises:
        getopt.GetoptError: If there is an error in the command-line arguments.

    Exits:
        2: If the interval is not provided or if there is an error in the command-line arguments.
        0: If the help option is provided.

    Functionality:
        - Connects to the trading database.
        - Retrieves ticker symbols from the 'Symbol' table.
        - Downloads trading data based on the specified interval.
        - Saves the downloaded data to the corresponding table in the database.
    """
    interval = ''

    try:
        opts, args = getopt.getopt(argv, "hi:", ["interval="])
    except getopt.GetoptError:
        print('tradingdatadownload.py -i <interval>')
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print('tradingdatadownload.py -i <interval>')
            sys.exit()
        elif opt in ("-i", "--interval"):
            interval = arg.lstrip()

    if interval == '':
        print('tradingdatadownload.py -i <interval>')
        sys.exit(2)

    try:
        cnxn = pyodbc.connect(f'Driver={{ODBC Driver 18 for SQL Server}};Server={db_server};Database={db_database};Uid={db_username};Pwd={db_password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;')
        cnxn_string = f'Driver={{ODBC Driver 18 for SQL Server}};Server={db_server};Database={db_database};Uid={db_username};Pwd={db_password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
    except pyodbc.Error as ex:
        sqlstate = ex.args[1]
        print(sqlstate)
        sys.exit(2)


    cnxn_url = URL.create("mssql+pyodbc", query={"odbc_connect": cnxn_string})

    engine = create_engine(cnxn_url)
    sym = pd.read_sql_table("Symbol", engine)
    ticker_symbols = sym['Symbol'].values.tolist()
    print(ticker_symbols)

    if interval == 'weekly':
        tickers = Ticker(ticker_symbols)
        weekly = tickers.history(period='5y', interval='1wk')
        print('Download weekly completed')
        saveToTable(weekly, 'Weekly', cnxn, engine)
        print('Saved to table weekly')

    if interval == 'daily':
        downloadDaily(ticker_symbols, cnxn, engine)

    if interval == 'hourly':
        tickers = Ticker(ticker_symbols)
        hourly = tickers.history(period='1mo', interval='1h')
        print('Download hourly completed')
        saveToTable(hourly, 'Hourly', cnxn, engine)
        print('Saved to table hourly')



if __name__ == '__main__':
    main(sys.argv[1:])
