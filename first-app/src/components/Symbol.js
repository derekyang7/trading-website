import React from 'react';
import { Component } from 'react';
import { Table } from 'react-bootstrap';
import history from './../history';
import {  } from 'react-router-dom';



class Symbol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loaded: false
        };
        //this.stockLookup = this.stockLookup.bind(this);
    }

    stockLookup(id) {
        console.log(id);
        history.push('/PriceList/' + id);

    }

    componentDidMount() {
        console.log('component did mount');
        fetch('http://localhost:3000/api/symbol')
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.setState({
                    data: data,
                    loaded: true
                });
            })

        // fetch('/api/symbol')
        //     .then(res => res.json())
        //     .then(data => this.setState({ data: data }));
    }

    render() {


        if (this.state.loaded == true) {

            const hits = this.state.data;
            return (
                <Table striped bordered hover variant = "dark" size = "xs">
                    <thead>
                        <tr>
                            <th>
                                Available Stocks:
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {hits.map(hit =>
                            <tr>
                                <td key={(hit.Symbol)} onClick={() => this.stockLookup(hit.Symbol)}>
                                    {hit.Symbol}
                                </td>
                            </tr>
                        )}
                    </tbody>


                </Table>
            );
        }
        else {
            return (
                <p>Not Loaded</p>
            )
        }

    }
}

export default Symbol;