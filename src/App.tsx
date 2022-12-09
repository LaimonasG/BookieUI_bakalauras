import './App.css';
import { Home } from './components/Home';
import { Genres } from './components/Genres';
import { Basket } from './components/Basket';
import { MainNavigation } from './components/MainNavigation';
import { BookList } from './components/BookList';
import  AdminBooks  from './components/AdminBooks';
import * as AuthService from "./services/auth.service";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/auth/profile";

import { BrowserRouter, Link, NavLink, Route, Routes,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface IUser {
  username:string,
  email:string,
  password: string,
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }  
  }, []);

  const logOut = () => {
    AuthService.logout();
    
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <NavLink to={"/"} className="navbar-brand">
          Bookie
        </NavLink>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink to={"/home"} className="nav-link">
              Home
            </NavLink>
          </li>

          {currentUser && (
            <li className="nav-item">
              <NavLink to={"/user"} className="nav-link">
                User
              </NavLink>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <NavLink to={"/genres"} className="nav-link">
                Genres
              </NavLink>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink to={"/profile"} className="nav-link">
                {currentUser.username}
              </NavLink>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink to={"/login"} className="nav-link">
                Login
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to={"/register"} className="nav-link">
                Sign Up
              </NavLink>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/genres' element={<Genres />} />
          <Route path='/basket' element={<Basket />} />
          <Route path='/books/*' element={<AdminBooks />} />
          </Routes>
      </div>
    </div>
  );
};

export default App;
