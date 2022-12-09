import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export class MainNavigation extends Component {

  render() {
    return (
      <Navbar bg="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <NavLink className="d-inline p-2 bg-dark text-white text-decoration-none" to="/">
              Home
            </NavLink>
            <NavLink className="d-inline p-2 bg-dark text-white text-decoration-none" to="/genres">
              Genres
            </NavLink>
            <NavLink className="d-inline p-2 bg-dark text-white text-decoration-none" to="/basket">
              Basket
            </NavLink>

          </Nav>
        </Navbar.Collapse>
      </Navbar>

    )
  }
}