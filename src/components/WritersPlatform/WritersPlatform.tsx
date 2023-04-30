import React, { Component, useState, useEffect, Dispatch } from "react";
import { Button, Modal } from "react-bootstrap";
import { LineChart, PieChart } from 'react-chartkick';
import { setUserRole } from "../../requests/AdminController";
import { IBookBought, ITextsBought, ISetRoleDto, IChapters, IGenres, getPointsWord, IBookAdd, ITextAdd, handleConfirmed, handleDenied, IChaptersAdd, getSubscriberWord } from '../../Interfaces';
import { getWriterBooks, getWriterTexts, getBookChapters } from "../../requests/WriterController";
import { getAllGenres } from '../../requests/GenresController';
import { addBook, addChapter } from "../../requests/BookController";
import { addText } from "../../requests/TextsController";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ChapterList from '../Chapters/ChapterList';
import TextReadView from '../Texts/TextReadView';
import AddBookForm from './books/AddBookForm';
import AddTextForm from './texts/AddTextForm';
import 'chartkick/chart.js';
import './WritersPlatform.css';
import useFetchCurrentUser from "../../useFetchCurrentUser";
import AddChapterForm from "./chapters/AddChapterForm";
import { login } from "../../services/auth.service";

interface IConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

async function SetUserRole(dto: ISetRoleDto) {
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

type ChaptersCount = {
  [bookId: number]: number;
};

const ConfirmationModal: React.FC<IConfirmationModalProps> = ({ isOpen, onClose, onAgree }) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ar sutinkate su puslapio privatumo politika?</p>
        <p>Apie ją galite paskaityti čia: https://bookie.privatumas.lt</p>
        <p></p>
        <p>Patvirtinus sutikimą, jums reikės prisijungti iš naujo.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Grįžti į namų puslapį
        </Button>
        <Button variant="primary" onClick={onAgree}>
          Sutinku
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
  const [showChapterList, setShowChapterList] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [updatePage, setUpdatePage] = useState(false);

  const [userrole, setUserrole] = useState<string | null>("");
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
  const navigate = useNavigate();

  useEffect(() => {
    setUserrole(localStorage.getItem("role"));
  }, []);

  async function GetBooks() {
    const xd = await getWriterBooks();

    // Loop through all books and fetch their chapters
    const booksWithChapters = await Promise.all(
      xd.map(async (book: IBookBought) => {
        const chapters = await getBookChapters(book.id, book.genreName);
        return {
          ...book,
          chapters: chapters,
        };
      })
    );

    setBooks(booksWithChapters);
  }

  async function GetGenres() {
    const xd = await getAllGenres();
    setGenres(xd);
  }

  async function GetTexts() {
    const xd = await getWriterTexts();
    setTexts(xd);
  }

  const onAuthenticated = () => {
    GetTexts();
    GetGenres();
    GetBooks();
  };

  useFetchCurrentUser(onAuthenticated, updatePage);

  const handleConfirmationClose = () => {
    navigate("/");
  };

  const handleAgree = () => {
    const setRole: ISetRoleDto = {
      roleName: "BookieWriter"
    };
    SetUserRole(setRole);
    setIsConfirmationOpen(false);
    navigate("/login");
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleAddText = () => {
    setShowAddTextModal(true);
  };

  const handleAddChapter = (book: IBookBought) => {
    setSelectedBook(book);
    setShowAddChapterModal(true);
  };

  const handleChapterFormSubmit = async (file: File, name: string, isFinished: number) => {
    const chapter: IChaptersAdd = {
      name: name,
      content: file,
      isFinished: isFinished,
      bookId: selectedBook!.id,
    };

    const response = await addChapter(chapter, selectedBook!.genreName);
    if (response.errorMessage === '') {
      if (response.chargedUsersCount === 0) {
        handleConfirmed(`Skyrius "${chapter.name}" pridėtas prie knygos "${selectedBook!.name}".`);
      } else {
        handleConfirmed(`Skyrius "${chapter.name}" pridėtas prie knygos "${selectedBook!.name}". Taškai gauti už ${response.chargedUsersCount} ${getSubscriberWord(response.chargedUsersCount)}`);
      }
      await GetBooks();
    } else {
      handleDenied(response.errorMessage);
    }
  };

  async function handleReadBookClick(book: IBookBought) {
    setSelectedBook(book);
    setShowChapterList(true);
  }

  async function handleReadTextClick(text: ITextsBought) {
    setSelectedText(text);
    setShowTextModal(true);
  }

  const handleHideModal = () => {
    setShowChapterList(false);
    setShowTextModal(false);
    setShowAddBookModal(false);
    setShowAddChapterModal(false);
    setShowAddTextModal(false);
    setShowAddChapterModal(false);

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

    const response = await addBook(genre, book);
    if (response === 'success') {
      handleConfirmed(`Knyga "${book.name}" pridėta sėkmingai.`);
      GetBooks();
    } else {
      handleDenied(response);
    }
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

    const response = await addText(genre, text);
    if (response === 'success') {
      handleConfirmed(`Tekstas "${text.name}" pridėtas sėkmingai.`);
      GetTexts();
    } else {
      handleDenied(response);
    }
  };

  return (
    <div>
      {userrole !== "BookieWriter" &&
        userrole !== "Admin" && (
          <ConfirmationModal
            isOpen={isConfirmationOpen}
            onClose={handleConfirmationClose}
            onAgree={handleAgree}
          />
        )}
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
                          {book.chapters?.length === 0 ? (
                            <button disabled={true} className="btn-disabled">Peržiūrėti turinį</button>
                          ) : (
                            <button className="view-content btn-color1" onClick={() => handleReadBookClick(book)}>Peržiūrėti turinį</button>
                          )}
                          <button className="comments btn-color3">Komentarai</button>
                          {book.isFinished === 0 && (
                            <button className="add-chapter btn-color2" onClick={() => handleAddChapter(book)}>Pridėti skyrių</button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

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

            {showAddChapterModal && (
              <AddChapterForm
                show={showAddChapterModal}
                onHide={handleHideModal}
                onSubmit={handleChapterFormSubmit}
              />
            )}

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