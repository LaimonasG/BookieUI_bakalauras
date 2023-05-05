import React, { useEffect, useState } from 'react';
import { getAllTexts } from "../../../requests/TextsController";
import jwt_decode from "jwt-decode";
import { MyToken, ITextsToBuy } from "../../../Interfaces";
import './TextList.css';
import TextView from '../Texts/TextView';
import { Pagination } from 'react-bootstrap';

export const TextList = () => {
  const [texts, setTexts] = useState<ITextsToBuy[]>([]);
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currText, setCurrText] = useState<ITextsToBuy>();

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const paginatedTexts = texts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(texts.length / itemsPerPage);

  const handlePageClick = (selectedPage: number) => {
    setCurrentPage(selectedPage - 1);
  };


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

  useEffect(() => {
    GetTexts();
  }, [Date.now()]);

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