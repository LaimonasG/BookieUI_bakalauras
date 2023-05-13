import React, { useRef } from 'react';
import DailyQuestion from './DailyQuestion';
import './Profile.css';
import PersonalInfo from './PersonalInfo';
import BoughtBooks from './BoughtBooksPanel';
import BoughtTexts from './BoughtTextsPanel';

interface PersonalInfoRef {
  fetchPoints: () => void;
}

const Profile: React.FC = () => {
  const personalInfoRef = useRef<PersonalInfoRef>(null);
  const handleQuestionAnswered = () => {
    personalInfoRef.current?.fetchPoints();
  };

  return (
    <div className="profile">
      <div className="personal-info-panel">
        <PersonalInfo ref={personalInfoRef} />
      </div>

      <div className="daily-question-panel">
        <DailyQuestion onQuestionAnswered={handleQuestionAnswered} />
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