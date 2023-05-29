import React, { useEffect, useState } from 'react';
import { getAllTexts } from "../../../requests/TextsController";
import { ITextsToBuy, useHandleAxiosError } from "../../../Interfaces";
import './TextList.css';
import TextView from '../Texts/TextView';
import { Pagination } from 'react-bootstrap';
import { AxiosError } from 'axios';
import { getUserBlockedStatus } from '../../../requests/AdminController';

export const TextList = () => {
  const [texts, setTexts] = useState<ITextsToBuy[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currText, setCurrText] = useState<ITextsToBuy>();
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);
  const handleAxiosError = useHandleAxiosError();
  const userIsLogged = localStorage.getItem("user") !== null;

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const paginatedTexts = texts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(texts.length / itemsPerPage);

  const handlePageClick = (selectedPage: number) => {
    setCurrentPage(selectedPage - 1);
  };

  async function GetTexts() {
    const genreName = localStorage.getItem("genreName");
    if (genreName) {
      try {
        const xd = await getAllTexts(genreName);
        setTexts(xd);
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    }

  }

  const handleTileClick = (event: React.MouseEvent<HTMLDivElement>, text: ITextsToBuy) => {
    event.stopPropagation();
    setCurrText(text);
    toggleFormStatus();
  };

  function toggleFormStatus() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    GetTexts();

    if (userIsLogged) {
      SetUserBlockedStatus();
    }
  }, []);

  async function SetUserBlockedStatus() {
    const isBlocked = await getUserBlockedStatus();
    setIsUserBlocked(isBlocked);
  }

  if (texts.length === 0) {
    return (
      <div></div>
    )
  }
  return (
    <div className="text-tiles-section">
      <h2 className="text-tiles-section-title">Tekstai</h2>
      <div className="text-tiles-grid" >
        {paginatedTexts.map((text, index) => (
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
          isBlocked={isUserBlocked}
        />
      )}
      <Pagination className="justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index === currentPage}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}