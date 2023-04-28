import React, { useState, useEffect } from 'react';
import './PersonalInfo.css';
import UpdateInfoFormModal from './EditPersonalInfo';
import { IProfile, IPersonalInfo } from '../../Interfaces';
import { getProfile, updatePersonalInfo } from '../../requests/ProfileController';

const PersonalInfo: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IProfile>();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const xd = await getProfile();
      setCurrentUser(xd);
    };

    fetchUserData();
  }, []);

  const handleEditInfo = () => {
    setShowUpdateModal(true);
  };

  const handleUpdateInfo = async (userName: string, name: string, surname: string, email: string) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) {
        return prevUser;
      }
      return {
        ...prevUser,
        name,
        surname,
        email,
      };
    });

    const personalInfo: IPersonalInfo = {
      userName,
      name,
      surname,
      email,
    };


    const result = await updatePersonalInfo(personalInfo);
    setShowUpdateModal(false);
  };

  const handleBuyMorePoints = () => {
    // Implement buying more points functionality
  };

  return (
    <div className="personal-info">
      <h2>Asmeninė informacija</h2>
      {currentUser && (
        <>
          <p>Naudotojo vardas: {currentUser.userName}</p>
          <p>Vardas: {currentUser.name}</p>
          <p>Pavardė: {currentUser.surname}</p>
          <p>Elektroninis paštas: {currentUser.email}</p>
          <p>Taškai sąskaitoje: {currentUser.points}</p>
          <button className="edit-btn" onClick={handleEditInfo}>Redaguoti informaciją</button>
          <button className="buy-btn" onClick={handleBuyMorePoints}>Papildyti taškus</button>
        </>
      )}
      {showUpdateModal && (
        <UpdateInfoFormModal
          show={showUpdateModal}
          currentUser={currentUser}
          onHide={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateInfo}
        />
      )}
    </div>
  );
};

export default PersonalInfo;