import React from 'react';
import { Component } from "react";
import { Button, Card } from 'react-bootstrap'
class Test extends Component {
    render() {
        return (
            <div className='app'>
                <p>My first app!</p>
                <p>
                    <Button variant="warning">
                        My Button
                    </Button>
                </p>

                <Card >
                    <Card.Header as="h5" className='body-text'>Hello Derek</Card.Header>
                    <Card.Body>

                        <Card.Text className='body-text'>My name is Derek</Card.Text>
                    </Card.Body>
                </Card>
            </div>

        );
    }
}

export default Test;


