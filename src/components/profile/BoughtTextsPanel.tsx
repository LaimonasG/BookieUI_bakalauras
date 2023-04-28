import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BoughtTextsPanel.css';
import { ITextsBought, getPointsWord } from '../../Interfaces';
import ChapterList from '../Chapters/ChapterList';
import { getProfileTexts } from '../../requests/ProfileController';
import TextReadView from '../Texts/TextReadView';


const BoughtTexts: React.FC = () => {
  const [texts, setTexts] = useState<ITextsBought[]>([]);
  const [showTextRead, setShowTextRead] = useState(false);
  const [selectedText, setSelectedText] = useState<ITextsBought | null>(null);

  useEffect(() => {
    const fetchTexts = async () => {
      const xd = await getProfileTexts();
      setTexts(xd);
    }
    fetchTexts();
  }, []);

  const readText = (text: ITextsBought) => {
    setSelectedText(text);
    setShowTextRead(true);
  };

  const handleHideModal = () => {
    setShowTextRead(false);
  }

  return (
    <div className="text-list">
      <h3>Tekstai</h3>
      {texts.length === 0 ? (
        <p>Knygų sąrašas tuščias</p>
      ) : (
        <div className="scrollable-panel">
          <ul>
            {texts.map((text) => (
              <li key={text.id}>
                <p className="text-name"> Teksto pavadinimas: {text.name}</p>
                <p className="text-price"> Kaina: {text.price} {getPointsWord(text.price)}</p>
                <p className="text-description"> Įkelta: {new Date(text.created.toString()).toISOString().split('T')[0]}</p>
                <div>
                  <button className="view-content btn-color1" onClick={() => readText(text)}>Peržiūrėti turinį</button>
                  <button className="comments btn-color3">Komentarai</button>
                </div>
              </li>
            ))}
            {showTextRead && selectedText && (
              <TextReadView
                text={selectedText}
                show={showTextRead}
                onHide={handleHideModal}
              />
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BoughtTexts;