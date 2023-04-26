import './App.css';
import Home from './components/Home/Home';
import { Genres } from './components/genres/Genres';
import { Basket } from './components/basket/Basket';
import { Navbar } from './components/NavBar/MainNavigation';
import Books from './components/Reader content/Content';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/auth/profile";
import WritersPlatform from './components/WritersPlatform/WritersPlatform';
import { Helmet } from 'react-helmet';

import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { color } from '@mui/system';



function App() {
  return (
    <div >

      {/* <Helmet>
          <style>{'body { background-color: #5767aa; margin:0 auto; }'}</style>
      </Helmet>  */}
      <Navbar />

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prisijungti" element={<Login />} />
          <Route path="/registruotis" element={<Register />} />
          <Route path="/profilis" element={<Profile />} />
          <Route path='/žanrai' element={<Genres />} />
          <Route path='/krepšelis' element={<Basket />} />
          <Route path='/turinys/*' element={<Books />} />
          <Route path='/rašytojas' element={<WritersPlatform useNavigate={useNavigate} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
