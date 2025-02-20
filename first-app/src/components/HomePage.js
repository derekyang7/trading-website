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
                Welcome to my stocks page!
                <img class='photo' src={Stonks} alt='stonks'></img>
            </div>
            </main>


        )
    }

}

export default HomePage;
