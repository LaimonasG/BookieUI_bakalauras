import React, { useState, useEffect } from 'react';
import { getAvailablePayments, payForPoints } from '../../requests/ProfileController';
import { IPayment, getAddedWord, getPointsWord, handleConfirmed, handleDenied, useHandleAxiosError } from '../../Interfaces';
import { Button, Modal, Form } from 'react-bootstrap';
import './BuyPoints.css';
import { AxiosError } from 'axios';

interface PaymentOffersProps {
  onClose: () => void;
  onPointsUpdated: () => void;
}

const PaymentOffers: React.FC<PaymentOffersProps> = ({ onClose, onPointsUpdated }) => {
  const [paymentOffers, setPaymentOffers] = useState<IPayment[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<IPayment | null>(null);

  const handleAxiosError = useHandleAxiosError();

  useEffect(() => {
    const fetchPaymentOffers = async () => {
      try {
        const offers = await getAvailablePayments();
        setPaymentOffers(offers);
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    };

    fetchPaymentOffers();
  }, []);

  const handlePaymentOfferClick = (offer: IPayment) => {
    setSelectedOffer(offer);
  };

  const handlePaymentConfirm = async () => {
    if (selectedOffer) {
      try {
        const response = await payForPoints(selectedOffer.id);
        if (response === 'success') {
          handleConfirmed(`Mokėjimas patvirtintas, jums ${getAddedWord(selectedOffer.points)} ${selectedOffer.points} ${getPointsWord(selectedOffer.points)}`);
          onPointsUpdated();
          onClose();
        } else {
          handleDenied(response);
          onClose();
        }
      } catch (error) {
        handleAxiosError(error as AxiosError);
        onClose();
      }
    }
  };

  return (
    <Modal show={true} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Mokėjimo pasiūlymai</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-offers-tiles">
          {paymentOffers.map((offer) => (
            <div
              className={`payment-offer-tile${selectedOffer && offer.id === selectedOffer.id ? ' selected' : ''}`}
              key={offer.id}
              onClick={() => handlePaymentOfferClick(offer)}
            >
              <p>Taškai: {offer.points}</p>
              <p>Kaina: {offer.price}€</p>
            </div>
          ))}
        </div>
        <div className="payment-confirm">
          {selectedOffer ? (
            <>
              <p>Patvirtinti mokėjimą pirkti {selectedOffer.points} {getPointsWord(selectedOffer.points)} už {selectedOffer.price}€?</p>
              <Button variant="primary" onClick={handlePaymentConfirm}>
                Patvirtinti
              </Button>
            </>
          ) : (
            <p>Prašome pasirinkti mokėjimo pasiūlymą</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentOffers;