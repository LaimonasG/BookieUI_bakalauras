import { useEffect, useState } from 'react';
import { getTokenExpirationTime, getCurrentUser, logout } from '../../services/auth.service';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faList, faUser, faSignOutAlt, faPenNib, faUserCog } from '@fortawesome/free-solid-svg-icons';
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
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  const navbarClass = isAdminPage ? 'navbar-custom-admin' : 'navbar-custom';

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        const role = localStorage.getItem("role");
        if (user !== null) {
          setCurrentUser(user);
          setCurrentRole(role);
        }
      } catch (error) {
        //console.error(error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.setItem('Role', '');
    setCurrentUser(undefined);
  };

  return (
    <BootstrapNavbar expand="md" variant="dark" className={navbarClass}>
      <BootstrapNavbar.Brand as={Link} to="/">
        <FontAwesomeIcon icon={faBook} className="navbar-brand-icon" />
        Bookie
      </BootstrapNavbar.Brand>
      <Nav className="navbar-nav-custom">
        <Nav.Link
          as={Link}
          to="/genres"
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
              className={location.pathname === "/profile" ? "nav-link-active" : ""}
            >
              <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
              Profilis
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/writer"
              className={location.pathname === "/writer" ? "nav-link-active" : ""}>
              <FontAwesomeIcon icon={faPenNib} className="nav-item-icon" />
              Rašytojo platforma
            </Nav.Link>
            <Nav.Link as={Link} to="/" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-item-icon" />
              Atsijungti
            </Nav.Link>
            {(currentRole && currentRole === "Admin") &&
              <Nav.Link as={Link} to="/admin" >
                <FontAwesomeIcon icon={faUserCog} className="nav-item-icon" />
                Administratorius
              </Nav.Link>
            }
          </>
        ) : (
          <>
            <Nav.Link
              as={Link}
              to="/login"
              className={location.pathname === "/login" ? "nav-link-active" : ""}>
              <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
              Prisijungti
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/register"
              className={location.pathname === "/register" ? "nav-link-active" : ""}>
              <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
              Registruotis
            </Nav.Link>
          </>
        )}
      </Nav>
    </BootstrapNavbar>
  );
};