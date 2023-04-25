import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faList, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import './NavBar.css';

interface IUser {
  username: string;
  email: string;
  password: string;
}

export const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleNavToggle = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const handleNavCollapse = () => {
    setIsNavExpanded(false);
  };

  const handleLogout = () => {
    localStorage.setItem('Role', '');
    setCurrentUser(undefined);
  };

  return (
    <BootstrapNavbar expand="md" variant="dark" className="navbar-custom">
      <BootstrapNavbar.Brand as={Link} to="/">
        <FontAwesomeIcon icon={faBook} className="navbar-brand-icon" />
        Bookie
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle onClick={handleNavToggle}>
        <FontAwesomeIcon icon={faBars} className="navbar-toggler-icon" />
      </BootstrapNavbar.Toggle>
      <BootstrapNavbar.Collapse id="navbar-collapse" className="justify-content-end" in={isNavExpanded} onExited={handleNavCollapse}>
        <Nav className="navbar-nav-custom">
          <Nav.Link as={Link} to="/" onClick={handleNavCollapse}>
            <FontAwesomeIcon icon={faHome} className="nav-item-icon" />
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/genres" onClick={handleNavCollapse}>
            <FontAwesomeIcon icon={faList} className="nav-item-icon" />
            Genres
          </Nav.Link>
          {currentUser ? (
            <>
              <Nav.Link as={Link} to="/profile" onClick={handleNavCollapse}>
                <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-item-icon" />
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" onClick={handleNavCollapse}>
                <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleNavCollapse}>
                <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                Sign Up
              </Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};