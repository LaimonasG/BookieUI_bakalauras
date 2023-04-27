import React from 'react'
import { useEffect, useState,useCallback } from 'react';
import { getTokenExpirationTime, getCurrentUser, logout } from './services/auth.service';
import { useNavigate } from 'react-router-dom';

  type OnAuthenticated = () => void;

  const useFetchCurrentUser = (onAuthenticated:OnAuthenticated, updatePage:boolean) => {
    const navigate = useNavigate()
  
    const memoizedOnAuthenticated = useCallback(onAuthenticated, []);
  
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = getCurrentUser();
          console.log('user:',user);
          if (user !== null) {
            const tokenExpirationTime = getTokenExpirationTime(user.accessToken);
            if (tokenExpirationTime && Date.now() >= tokenExpirationTime) {
              logout();
              navigate('/login')          
            } else {
              console.log('all good g');
              memoizedOnAuthenticated();
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchCurrentUser();
    }, [memoizedOnAuthenticated]);

  };


export default useFetchCurrentUser


