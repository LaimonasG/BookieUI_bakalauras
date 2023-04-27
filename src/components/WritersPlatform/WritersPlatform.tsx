import React, { Component, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { LineChart, PieChart } from 'react-chartkick';
import { setUserRole } from "../../requests/AdminController";
import { IBookBought, ITextsBought, ISetRoleDto, IChapters, IGenres, getPointsWord, IBookAdd, ITextAdd } from '../../Interfaces';
import { getWriterBooks, getWriterTexts, getBookChapters } from "../../requests/WriterController";
import { getAllGenres } from '../../requests/GenresController';
import { addBook } from "../../requests/BookController";
import { addText } from "../../requests/TextsController";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ChapterList from '../Chapters/ChapterList';
import TextReadView from '../Texts/TextReadView';
import AddBookForm from './books/AddBookForm';
import AddTextForm from './texts/AddTextForm';
import 'chartkick/chart.js';
import './WritersPlatform.css';
import useFetchCurrentUser from "../../useFetchCurrentUser";

interface IConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

async function SetRole(dto: ISetRoleDto) {
  const xd = await setUserRole(dto);
  localStorage.setItem("role", "BookieWriter");
}

interface WritersPlatformProps {
  useNavigate: () => NavigateFunction;
}

interface IWritersPlatformState {
  isConfirmationOpen: boolean;
  isOpen: boolean;
  books: IBookBought[];
  texts: ITextsBought[];
  pieChartData: any[];
  lineChartData: any;
}

const ConfirmationModal: React.FC<IConfirmationModalProps> = ({ isOpen, onClose, onAgree }) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ar sutinkate su puslapio privatumo politika?</p>
        <p>Apie ją galite paskaityti čia: https://bookie.privatumas.lt</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Back to Home Page
        </Button>
        <Button variant="primary" onClick={onAgree}>
          Agree
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const WritersPlatform: React.FC<WritersPlatformProps> = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [books, setBooks] = useState<IBookBought[]>([]);
  const [texts, setTexts] = useState<ITextsBought[]>([]);
  const [genres, setGenres] = useState<IGenres[]>([]);
  const [selectedBook, setSelectedBook] = useState<IBookBought | null>(null);
  const [selectedtext, setSelectedText] = useState<ITextsBought | null>(null);
  const [chapters, setChapters] = useState<IChapters[] | null>(null);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [updatePage, setUpdatePage] = useState(false);

  const [userRole, setUserRole] = useState<string | null>("");
  const [pieChartData, setPieChartData] = useState<any[]>([
    ["Fantasy", 10],
    ["Mystery", 20],
    ["Romance", 15],
    ["Horror", 5]
  ]);
  const [lineChartData, setLineChartData] = useState<any>({
    "2022-01-01": 4,
    "2022-02-01": 2,
    "2022-03-01": 6,
    "2022-04-01": 8,
    "2022-05-01": 5
  });

  async function GetBooks() {
    const xd = await getWriterBooks();
    setBooks(xd);
  }

  async function GetGenres() {
    const xd = await getAllGenres();
    setGenres(xd);
  }

  async function GetTexts() {
    const xd = await getWriterTexts();
    setTexts(xd);
  }

  async function GetChaptersForBook(bookId: number, genreName: string): Promise<IChapters[]> {
    const data = await getBookChapters(bookId, genreName);
    return data;
  }
  const onAuthenticated = () => {
    GetTexts();
    GetGenres();
    GetBooks();
  };

  useFetchCurrentUser(onAuthenticated, updatePage);

  const toggleFormStatus = () => {
    setIsOpen(!isOpen);
  };

  const handleConfirmationClose = () => {
    const navigate = useNavigate();
    navigate("/");
  };

  const handleAgree = () => {
    const setRole: ISetRoleDto = {
      roleName: "BookieWriter"
    };
    SetRole(setRole);
    setIsConfirmationOpen(false);
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleAddText = () => {
    setShowAddTextModal(true);
  };

  const handleAddChapter = () => {
    // handle add book logic here
  };

  async function handleReadBookClick(book: IBookBought) {
    const chapters = await GetChaptersForBook(book.id, book.genreName);
    book.chapters = chapters;
    setSelectedBook(book);
    setShowChapterList(true);
  }

  async function handleReadTextClick(text: ITextsBought) {
    setSelectedText(text);
    setShowTextModal(true);
    console.log(texts);
  }

  const handleHideModal = () => {
    setShowChapterList(false);
    setShowTextModal(false);
    setShowAddBookModal(false);
    setShowAddChapterModal(false);
    setShowAddTextModal(false);

    setUpdatePage(true);
  };

  const handleBookFormSubmit = async (
    name: string,
    genre: string,
    description: string,
    chapterPrice: number,
    bookPrice: number,
    coverImage: File
  ) => {
    const book: IBookAdd = {
      name: name,
      description: description,
      chapterPrice: chapterPrice.toString(),
      bookPrice: bookPrice.toString(),
      coverImage: coverImage,
    };

    const xd = await addBook(genre, book);
    console.log(name, description, chapterPrice, bookPrice, coverImage);
  };

  const handleTextFormSubmit = async (
    name: string,
    genre: string,
    description: string,
    textPrice: number,
    coverImage: File,
    content: File
  ) => {
    const text: ITextAdd = {
      name: name,
      description: description,
      price: textPrice.toString(),
      content: content,
      coverImage: coverImage,
    };

    const xd = await addText(genre, text);
  };


  return (
    <div>
      {/* {userRole !== "BookieWriter" &&
        userRole !== "Admin" && (
          <ConfirmationModal
            isOpen={isConfirmationOpen}
            onClose={handleConfirmationClose}
            onAgree={handleAgree}
          />
        )} */}


      <div className="writers-platform">
        <div className="textsAndBooks">
          <div className="books-and-texts">
            <div className="add-button-container">
              <Button className="add-btn" onClick={handleAddText}>
                Pridėti tekstą
              </Button>
              <Button className="add-btn" onClick={handleAddBook}>
                Pridėti knygą
              </Button>
            </div>

            <div className="book-list">
              <h3>Knygos</h3>
              {books.length === 0 ? (
                <p>Knygų sąrašas tuščias</p>
              ) : (
                <div className="scrollable-panel">
                  <ul>
                    {books.map((book) => (
                      <li key={book.id}>
                        <p className="book-name"> Knygos pavadinimas: {book.name}</p>
                        <p className="book-price"> Kaina: {book.price} {getPointsWord(book.price)}</p>
                        <p className="book-description"> Įkelta: {new Date(book.created.toString()).toISOString().split('T')[0]}</p>
                        <div>
                          <button className="view-content btn-color1" onClick={() => handleReadBookClick(book)}>Peržiūrėti turinį</button>
                          <button className="comments btn-color3">Komentarai</button>
                          <button className="add-chapter btn-color2">Pridėti skyrių</button>
                        </div>
                      </li>
                    ))}
                    {showChapterList && selectedBook && (
                      <ChapterList
                        book={selectedBook}
                        show={showChapterList}
                        onHide={handleHideModal}
                      />
                    )}

                    {showAddBookModal && (
                      <AddBookForm
                        show={showAddBookModal}
                        genrelist={genres}
                        onHide={handleHideModal}
                        onSubmit={handleBookFormSubmit}
                      />
                    )}

                    {showAddTextModal && (
                      <AddTextForm
                        show={showAddTextModal}
                        genrelist={genres}
                        onHide={handleHideModal}
                        onSubmit={handleTextFormSubmit}
                      />
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="text-list">
              <h3>Tekstai</h3>
              {texts.length === 0 ? (
                <p>Tekstų sąrašas tuščias</p>
              ) : (
                <div className="scrollable-panel">
                  <ul>
                    {texts.map((text) => (
                      <li key={text.id}>
                        <p className="book-name"> Teksto pavadinimas: {text.name}</p>
                        <p className="book-price"> Kaina: {text.price} {getPointsWord(text.price)}</p>
                        <p className="book-description"> Įkelta: {new Date(text.created.toString()).toISOString().split('T')[0]}</p>
                        <div>
                          <button className="view-content btn-color1" onClick={() => handleReadTextClick(text)}>Peržiūrėti turinį</button>
                          <button className="comments btn-color2">Komentarai</button>
                        </div>
                      </li>

                    ))}
                    {showTextModal && selectedtext && (
                      <TextReadView
                        text={selectedtext}
                        show={showTextModal}
                        onHide={handleHideModal}
                      />
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="statistics">
            <h2>Pardavimų statistika</h2>
            <div className="chart">
              <PieChart data={pieChartData} />
            </div>
            <div className="chart">
              <LineChart data={lineChartData} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WritersPlatform;