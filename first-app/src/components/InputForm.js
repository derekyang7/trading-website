/**
 * InputForm component for stock lookup.
 *
 * This component renders a form that allows users to enter a stock symbol and fetches
 * stock data from an API. The fetched data is then displayed in a table format.
 *
 * @extends React.Component
 *
 * @property {Object} state - The state of the component.
 * @property {Array} state.data - The fetched stock data.
 * @property {boolean} state.loaded - Indicates if the data has been loaded.
 * @property {string} state.stockName - The stock symbol entered by the user.
 */
import React from 'react';
import { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            data: [],
            loaded: false,
            stockName: ""

        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        fetch('http://localhost:3000/api/symbol/' + this.state.stockName)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                this.setState({
                    data: data,
                    loaded: true
                });
            })


    };


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
            <div>
                <form className='my-form' onSubmit={this.handleSubmit}>
                    <Form>
                        <Form.Group>
                            <Form.Label>Stock Lookup</Form.Label>
                            <Form.Control type="text" value={this.state.stockName}
                            onChange={event => this.setState({ stockName: event.target.value })}
                            placeholder="Enter Stock Symbol"
                            required />
                        </Form.Group>
                        <Button variant="dark" type="submit">
                            Submit
  </Button>
                    </Form>

                </form>
                <div className='my-form-text'>
                    {content}
                </div>

            </div>



        );

    }
}

export default InputForm;
