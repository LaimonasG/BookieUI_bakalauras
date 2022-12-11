import React, { Component, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { FaBars, FaTimes,FaBook } from "react-icons/fa";
import  "./extra/NavBarStyles.css";
import { IUser } from '../App';
import * as AuthService from "../services/auth.service";
import { useEffect, useState } from 'react';

export const Navbar = () => {
	const navRef = useRef<HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  const logOut = () => {
    AuthService.logout();
    localStorage.setItem('Role','');
    setCurrentUser(undefined);
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }  
  }, []);

	const showNavbar = () => {
    if(navRef.current)
		navRef.current.classList.toggle("responsive_nav");
	};

	return (
		<header>
			<FaBook size={42} />
			<nav ref={navRef}>
				<a href="/">Home</a>
        <a href="/genres">Genres</a>
				<a href="/user">Basket</a>
        {currentUser ? (
          <a href="/login" onClick={logOut}>LogOut</a>
        ):(
        <div>
          <a href="/login">Login</a>
          <a href="/register">Sign up</a>
        </div>
        )}
				
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button className="nav-btn" onClick={showNavbar}>
				<FaBars />
			</button>
		</header>
	);
}