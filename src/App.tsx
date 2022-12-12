import './App.css';
import { Home } from './components/Home';
import { Genres } from './components/genres/Genres';
import { Basket } from './components/basket/Basket';
import {Navbar} from './components/MainNavigation';
import  Books  from './components/books/Books';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/auth/profile";
import  "./components/extra/NavBarStyles.css";

import { BrowserRouter, Link, NavLink, Route, Routes,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface IUser {
  username:string,
  email:string,
  password: string,
}

//books puslapy sucentruot lentele

//books puslapy gauti userId kad naudotojas galetu istrint savo knygas

//komentaru modal padaryt

const App: React.FC = () => {
  return (
    <div >
      <Navbar />

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/genres' element={<Genres />} />
          <Route path='/basket' element={<Basket />} />
          <Route path='/books/*' element={<Books />} />
          </Routes>
      </div>
    </div>
  );
};

export default App;
