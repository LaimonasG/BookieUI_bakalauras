import React, { useState } from 'react';
import DailyQuestion from './DailyQuestion';
import './Profile.css';
import useFetchCurrentUser from "../../useFetchCurrentUser";
import PersonalInfo from './PersonalInfo';
import BoughtBooks from './BoughtBooksPanel';
import BoughtTexts from './BoughtTextsPanel';

const Profile: React.FC = () => {
  const [updatePage, setUpdatePage] = useState(false);
  const onAuthenticated = () => {
    // GetTexts();
    // GetGenres();
    // GetBooks();
  };

  useFetchCurrentUser(onAuthenticated, updatePage);
  return (
    <div className="profile">
      <div className="personal-info-panel">
        <PersonalInfo />
      </div>

      <div className="daily-question-panel">
        <DailyQuestion />
      </div>

      <div className="bought-books-panel">
        <BoughtBooks />
      </div>

      <div className="texts-panel">
        <BoughtTexts />
      </div>
    </div>
  );
};

export default Profile;