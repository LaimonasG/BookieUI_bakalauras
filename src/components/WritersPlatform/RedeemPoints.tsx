import React, { useState } from 'react';
import { IPayment, getPointsWord } from '../../Interfaces';
import { Button, Modal } from 'react-bootstrap';
import './RedeemPoints.css';

interface PaymentOffersProps {
  onClose: () => void;
}

const RedeemPoints: React.FC<PaymentOffersProps> = ({ onClose }) => {
  const [selectedPercentage, setSelectedPercentage] = useState<number>();
  const userpoints = 120;
  const eurIsWorth = 0.1;

  const pointValues = [25, 50, 75, 100];
  const handleRedeemPoints = async (percentage: number) => {
    setSelectedPercentage(percentage);
    console.log(`Redeeming ${percentage}% points.`);
  };

  const selectedAmount = selectedPercentage ? (selectedPercentage / 100) * userpoints : null;

  return (
    <Modal show={true} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div>Mokėjimo pasiūlymai</div>
          <div className="points-balance">
            Dabartinis taškų balansas: {userpoints}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-offers-tiles">
          {pointValues.map((percentage) => {
            const redeemableAmount = ((percentage / 100) * userpoints * eurIsWorth).toFixed(2);
            const isDisabled = parseFloat(redeemableAmount) < 5;
            return (
              <div
                className={`redemption-tile${isDisabled ? ' disabled' : ''}`}
                key={percentage}
                onClick={() => !isDisabled && handleRedeemPoints(percentage)}
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
              <p>Ar tikrai norite iškeisti {selectedAmount.toFixed(0)} {getPointsWord(selectedAmount)} į {((selectedPercentage / 100) * userpoints * eurIsWorth).toFixed(2)}€?</p>
              <Button variant="primary">
                Patvirtinti
              </Button>
            </>
          ) : (
            <p>Prašome pasirinkti taškų kiekį</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RedeemPoints;