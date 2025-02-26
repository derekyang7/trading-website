/**
 * HomePage component renders the main content of the homepage.
 */
import React from 'react';
import { Component } from 'react';
import Stonks from "./stonks.jpg"

class HomePage extends Component {
    render() {
        return (
            <main>
                <div class='big-text'>
                    <img className='photo' src={Stonks} alt='stocks' />
                </div>
                <div class='big-text'>
                    Welcome to Stock Tracker!
                </div>
                <div class='small-text'>
                    Here you can find various information about stocks and stock prices.
                    These include the current price of a stock, the price history of a stock, and the price trends of a stock.
                </div>
                <div class='small-text'>
                    To get started, click on the Stock Symbols tab to see a list of stock symbols.
                    Head to the Search tab to search for a specific stock.
                </div>

            </main>
        )
    }

}

export default HomePage;
