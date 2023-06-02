import React, { useEffect, useState } from 'react';
import { IProfile, getPointsWord, getPointsWordForRedeem, handleConfirmed, useHandleAxiosError } from '../../Interfaces';
import { Button, Modal } from 'react-bootstrap';
import './RedeemPoints.css';
import { redeemPay } from '../../requests/WriterController';
import { AxiosError } from 'axios';
import { getProfile } from '../../requests/ProfileController';

interface PaymentOffersProps {
  onClose: () => void;
}

const RedeemPoints: React.FC<PaymentOffersProps> = ({ onClose }) => {
  const [selectedPercentage, setSelectedPercentage] = useState<number>();
  const [points, setPoints] = useState<number>(0);

  const eurIsWorth = 0.1;

  const handleAxiosError = useHandleAxiosError();

  const pointValues = [25, 50, 75, 100];

  useEffect(() => {
    GetProfile();
  }, []);

  async function GetProfile() {
    try {
      const xd = await getProfile();
      setPoints(xd.points);
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  }

  const handleRedeemPoints = async (percentage: number) => {
    setSelectedPercentage(percentage);
    try {
      const response = await redeemPay(percentage);

      if (response.confirmed) {
        handleConfirmed(`${response.pointAmount} ${getPointsWord(response.pointAmount)} buvo išgryninti į ${response.eurAmount}€`);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
    onClose();
  };

  const selectedAmount = selectedPercentage ? (selectedPercentage / 100) * points : null;

  return (
    <Modal show={true} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div>Mokėjimo pasiūlymai</div>
          <div className="points-balance">
            Dabartinis taškų balansas: {points}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-offers-tiles">
          {pointValues.map((percentage) => {
            const redeemableAmount = ((percentage / 100) * points * eurIsWorth).toFixed(2);
            const isDisabled = parseFloat(redeemableAmount) < 5;
            return (
              <div
                className={`redemption-tile${isDisabled ? ' disabled' : ''}`}
                key={percentage}
                onClick={() => {
                  if (!isDisabled) {
                    setSelectedPercentage(percentage);
                  }
                }}
              >
                <p>{percentage}%</p>
                <p>{redeemableAmount}€</p>
              </div>
            );
          })}
        </div>
        <div className="payment-confirm">
          {selectedPercentage && selectedAmount ? (
            <>
              <p>Ar tikrai norite iškeisti {selectedAmount.toFixed(0)} {getPointsWordForRedeem(selectedAmount)} į {((selectedPercentage / 100) * points * eurIsWorth).toFixed(2)}€?</p>
              <Button variant="primary"
                onClick={() => handleRedeemPoints(selectedPercentage)}
              >
                Patvirtinti
              </Button>
            </>
          ) : (
            <p>Prašome pasirinkti taškų kiekį</p>
          )}
        </div>
      </Modal.Body>
    </Modal >
  );
};

export default RedeemPoints;