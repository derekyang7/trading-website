/**
 * Contact component renders a contact form with email, password fields,
 * and a submit button. It uses React Bootstrap for styling.
 */
import React from 'react';
import { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class Contact extends Component {
    render() {
        return (
            <div class='my-form-text'>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Save Password" />
                    </Form.Group>
                    <Button variant="dark" type="submit">
                        Submit
  </Button>
                </Form>

            </div>

        )
    }

}

export default Contact;
