import { useEffect, useState } from 'react';
import { getTokenExpirationTime, getCurrentUser, logout } from '../../services/auth.service';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faList, faUser, faSignOutAlt, faPenNib } from '@fortawesome/free-solid-svg-icons';
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

  const location = useLocation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user !== null) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user !== null) {
          // Check if the user token has expired
          const tokenExpirationTime = getTokenExpirationTime(user);
          if (tokenExpirationTime && Date.now() >= tokenExpirationTime) {
            logout();
            setCurrentUser(undefined);
          } else {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleNavToggle = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const handleNavCollapse = () => {
    setIsNavExpanded(false);
  };

  const handleLogout = () => {
    logout();
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
          <Nav.Link
            as={Link}
            to="/genres"
            onClick={handleNavCollapse}
            className={location.pathname === "/genres" ? "nav-link-active" : ""}
          >
            <FontAwesomeIcon icon={faList} className="nav-item-icon" />
            Žanrai
          </Nav.Link>
          {currentUser ? (
            <>
              <Nav.Link
                as={Link}
                to="/profile"
                onClick={handleNavCollapse}
                className={location.pathname === "/profile" ? "nav-link-active" : ""}
              >
                <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                Profilis
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/writer"
                onClick={handleNavCollapse}
                className={location.pathname === "/writer" ? "nav-link-active" : ""}>
                <FontAwesomeIcon icon={faPenNib} className="nav-item-icon" />
                Rašytojo platforma
              </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-item-icon" />
                Atsijungti
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/login"
                onClick={handleNavCollapse}
                className={location.pathname === "/login" ? "nav-link-active" : ""}>
                <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                Login
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/register"
                onClick={handleNavCollapse}
                className={location.pathname === "/register" ? "nav-link-active" : ""}>
                <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                Registruotis
              </Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};