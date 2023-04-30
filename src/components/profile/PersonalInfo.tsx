import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import './PersonalInfo.css';
import UpdateInfoFormModal from './EditPersonalInfo';
import { IProfile, IPersonalInfo, handleConfirmed, handleDenied } from '../../Interfaces';
import { getProfile, updatePersonalInfo } from '../../requests/ProfileController';
import BuyPoints from './BuyPoints';

interface PersonalInfoRef {
  fetchPoints: () => void;
}

const PersonalInfo = forwardRef<PersonalInfoRef, {}>((props, ref) => {
  const [currentUser, setCurrentUser] = useState<IProfile>();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const fetchUserData = useCallback(async () => {
    const xd = await getProfile();
    setCurrentUser(xd);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useImperativeHandle(ref, () => ({
    fetchPoints: fetchUserData,
  }));

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditInfo = () => {
    setShowUpdateModal(true);
  };

  const handlePointsUpdated = () => {
    fetchUserData();
  };

  const handleUpdateInfo = async (userName: string, name: string, surname: string, email: string) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) {
        return prevUser;
      }
      return {
        ...prevUser,
        userName,
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
    console.log("updated info", personalInfo);

    setShowUpdateModal(false);
    const result = await updatePersonalInfo(personalInfo);
    if (result === "success")
      handleConfirmed(`Asmeninė informacija atnaujinta sėkmingai.`);
    else
      handleDenied(result);
  };

  const handleBuyMorePoints = () => {
    setShowPayModal(true);
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
      {showPayModal && (
        <BuyPoints
          onClose={() => setShowPayModal(false)}
          onPointsUpdated={handlePointsUpdated}
        />
      )}
    </div>
  );
});

export default PersonalInfo;