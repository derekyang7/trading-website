/**
 * PriceList component fetches and displays the price list of a stock symbol.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.match - The match object provided by the router.
 * @param {Object} props.match.params - The parameters from the URL.
 * @param {string} props.match.params.id - The stock symbol ID from the URL.
 *
 * @property {Array} state.data - The fetched data for the stock symbol.
 * @property {boolean} state.loaded - Indicates whether the data has been loaded.
 */
import React from 'react';
import { Component } from 'react';

class PriceList extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loaded: false,

        }
    }
    componentDidMount () {
        const { id } = this.props.match.params;

        fetch(`http://localhost:3000/api/symbol/${id}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            this.setState({
                data: data,
                loaded: true
            });
        });
      }

    render() {
        var content = "Please enter a stock symbol above.";
        if (this.state.loaded === true) {
            var data = this.state.data;

            content = (
                <table>
                    {data.map(d =>
                        <tr>
                            <td>{d.Date}</td>
                            <td>{d.Close}</td>
                        </tr>
                    )}
                </table>
            );

        }


        return (
            <main>
                <div className='big-text'>
                Price List for {this.props.match.params.id}:

            </div>
            <div className='price-list-text'>
                {content}
                </div>
            </main>


        )
    }

}

export default PriceList;
