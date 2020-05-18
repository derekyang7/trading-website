import React from 'react';
import { Component } from 'react';
import { Navbar, NavDropdown, Nav, Form, FormControl, Button } from 'react-bootstrap';

class MyNavbar extends Component {
    render() {
        return (
          <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">Stock Tracker</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/symbol">Stock Symbols</Nav.Link>
      <Nav.Link href="/search">Search</Nav.Link>
      <Nav.Link href="/contact">Sign Up</Nav.Link>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-light">Search</Button>
    </Form>
  </Navbar>
        );
    }
}

export default MyNavbar;