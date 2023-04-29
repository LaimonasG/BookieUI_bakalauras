import React, { useEffect, useState } from 'react';
import { getAllTexts } from "../../../requests/TextsController";
import jwt_decode from "jwt-decode";
import { MyToken, ITextsToBuy } from "../../../Interfaces";
import './TextList.css';
import TextView from '../Texts/TextView';

export const TextList = () => {
  const [texts, setTexts] = useState<ITextsToBuy[]>([]);
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currText, setCurrText] = useState<ITextsToBuy>();
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [scrollLeftAmount, setScrollLeftAmount] = useState<number>(0);

  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  let decodedToken: MyToken | undefined;
  try {
    decodedToken = jwt_decode<MyToken>(user.accessToken);
  } catch (error) {
    console.log('User does not have a token yet');
  }

  async function GetTexts() {
    const xd = await getAllTexts(localStorage.getItem("genreName")!);
    setTexts(xd);
  }

  const handleTileClick = (event: React.MouseEvent<HTMLDivElement>, text: ITextsToBuy) => {
    event.stopPropagation();
    setCurrText(text);
    toggleFormStatus();
  };

  function toggleFormStatus() {
    setIsOpen(!isOpen);
  };

  function scrollRight() {
    const container = document.getElementById('text-tiles-scroll-container');
    if (container) {
      container.scrollTo({
        left: scrollLeftAmount + container.offsetWidth,
        behavior: 'smooth'
      });
    }
  }

  function scrollLeft() {
    const container = document.getElementById('text-tiles-scroll-container');
    if (container) {
      container.scrollTo({
        left: scrollLeftAmount - container.offsetWidth,
        behavior: 'smooth'
      });
    }
  }
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setScrollLeftAmount(scrollLeft);
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < maxScrollLeft);
  }

  useEffect(() => {
    GetTexts();
  }, [Date.now()]);

  if (texts.length === 0) {
    return (
      <h1>Žanras "{genreName}" dar neturi tekstų.</h1>
    )
  }
  return (
    <div className="text-tiles-scrollable">
      <div className="text-tiles-section">
        <h2 className="text-tiles-section-title">Tekstai</h2>
        <div className="text-tiles-scroll-container" onScroll={handleScroll}>
          <div className="text-tiles-grid" >
            {texts.map((text, index) => (
              <div className="text-tile" key={index} onClick={(event) => handleTileClick(event, text)}>
                <img src={text.coverImageUrl} alt={text.name} className="text-tile-image" />
                <div className="text-tile-details">
                  <h2 className="text-tile-title">{text.name}</h2>
                  <p className="text-tile-author">{text.author}</p>
                  <div className="text-tile-footer"></div>
                </div>
              </div>
            ))}
          </div>
          {currText && (
            <TextView
              text={currText}
              isOpen={isOpen}
              onClose={toggleFormStatus}
            />
          )}

          {showLeftArrow && (
            <div className="text-tiles-scroll-arrow text-tiles-scroll-arrow-left" onClick={scrollLeft}>
              <i className="fas fa-chevron-left"></i>
            </div>
          )}
          {showRightArrow && (
            <div className="text-tiles-scroll-arrow text-tiles-scroll-arrow-right" onClick={scrollRight}>
              <i className="fas fa-chevron-right"></i>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}