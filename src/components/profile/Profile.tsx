import React, { useState } from 'react';
import DailyQuestion from './DailyQuestion';
import './Profile.css';
import useFetchCurrentUser from "../../useFetchCurrentUser";

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
        {/* Personal info panel content */}
      </div>

      <div className="daily-question-panel">
        <DailyQuestion />
      </div>

      <div className="bought-books-panel">
        {/* Bought books panel content */}
      </div>

      <div className="texts-panel">
        {/* Texts panel content */}
      </div>
    </div>
  );
};

export default Profile;