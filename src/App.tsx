import './App.css';
import Home from './components/Home/Home';
import { Genres } from './components/Genres/Genres';
import { Navbar } from './components/NavBar/MainNavigation';
import Content from './components/Reader content/Content';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Profile from "./components/profile/Profile";
import WritersPlatform from './components/WritersPlatform/WritersPlatform';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/genres' element={<Genres />} />
          <Route path='/contents/*' element={<Content />} />
          <Route path='/writer' element={<WritersPlatform useNavigate={useNavigate} />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
