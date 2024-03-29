import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import './BoughtTextsPanel.css';
import { ITextsBought, useHandleAxiosError } from '../../Interfaces';
import { getProfileTexts } from '../../requests/ProfileController';
import TextReadView from '../texts/TextReadView';
import CommentList from '../comments/CommentsList';
import { Pagination } from 'react-bootstrap';
import { getUserBlockedStatus } from '../../requests/AdminController';


const BoughtTexts: React.FC = () => {
  const [texts, setTexts] = useState<ITextsBought[]>([]);
  const [showTextRead, setShowTextRead] = useState(false);
  const [selectedText, setSelectedText] = useState<ITextsBought>();
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);


  const handleAxiosError = useHandleAxiosError();


  //pagination
  const [pageBook, setBookPage] = useState(0);
  const perPage = 2;
  const numTextPages = Math.ceil(texts.length / perPage);
  const textsToDisplay = texts.slice(pageBook * perPage, (pageBook + 1) * perPage);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const isBlocked = await getUserBlockedStatus();
        setIsUserBlocked(isBlocked);
        const xd = await getProfileTexts();
        setTexts(xd);
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    };

    fetchTexts();
  }, []);


  const readText = (text: ITextsBought) => {
    setSelectedText(text);
    setShowTextRead(true);
  };

  const handleHideModal = () => {
    setShowTextRead(false);
    setIsCommentsOpen(false);
  }

  const handleOpenComments = (text: ITextsBought) => {
    setSelectedText(text);
    setIsCommentsOpen(true);
  }

  return (
    <div className="text-list-container">
      <div className="text-list">
        <h3>Tekstai</h3>
        {texts.length === 0 ? (
          <p>Knygų sąrašas tuščias</p>
        ) : (
          <ul>
            {textsToDisplay.map((text) => (
              <li key={text.id}>
                <p className="text-name"> Teksto pavadinimas: {text.name}</p>
                <p className="text-description"> Įkelta: {new Date(text.created.toString()).toISOString().split('T')[0]}</p>
                <div>
                  <button className="view-content btn-color1" onClick={() => readText(text)}>Peržiūrėti turinį</button>
                  <button className="comments btn-color3" onClick={() => handleOpenComments(text)}>Komentarai</button>
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
            {isCommentsOpen && selectedText &&
              <CommentList
                isOpen={isCommentsOpen}
                onClose={handleHideModal}
                isProfile={!isUserBlocked}
                entityId={selectedText.id}
                commentType='Text'
                genreName={selectedText.genreName}
                bookId={0}
              />
            }
          </ul>
        )}
      </div>
      {numTextPages > 1 && (
        <Pagination
          size="sm"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          {Array.from(Array(numTextPages), (e, i) => (
            <Pagination.Item
              key={i}
              active={i === pageBook}
              onClick={() => setBookPage(i)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>

  );
};

export default BoughtTexts;