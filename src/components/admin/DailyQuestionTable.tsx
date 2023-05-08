import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { IQuestion, IQuestionAdd, handleConfirmed, handleDenied, useHandleAxiosError } from '../../Interfaces';
import QuestionFormModal from './DailyQuestionForm';
import { AxiosError } from 'axios';
import { createQuestion, getAllQuestions, removeQuestion } from '../../requests/AdminController';
import "./DailyQuestionTable.css";

const DailyQuestionTable: React.FC = () => {
  const [dailyQuestions, setDailyQuestions] = useState<IQuestion[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(dailyQuestions.length / questionsPerPage);
  const handleAxiosError = useHandleAxiosError();


  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const start = (currentPage - 1) * questionsPerPage;
  const end = start + questionsPerPage;
  const displayedQuestions = dailyQuestions.slice(start, end);

  const handleFormModalClose = () => {
    setShowFormModal(false);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const xd = await getAllQuestions();
        setDailyQuestions(xd);
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    };

    fetchQuestions();
  }, [useHandleAxiosError]);

  const handleSubmit = async (question: IQuestionAdd) => {

    try {
      const response = await createQuestion(question);
      if (response === 'success') {
        handleConfirmed(`Klausimas sėkmingai sukurtas.`);
        const questions = await getAllQuestions();
        setDailyQuestions(questions);
      } else {
        handleDenied(response);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      const response = await removeQuestion(questionId);
      if (response === 'success') {
        handleConfirmed(`Klausimas ištrintas sėkmingai.`);
        const questions = await getAllQuestions();
        setDailyQuestions(questions);
      } else {
        handleDenied(response);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  };


  return (
    <div className="daily-question-table-container">
      <div className="table-header">
        <h2>Dienos klausimas</h2>
        <Button onClick={() => setShowFormModal(true)}>Pridėti klausimą</Button>
      </div>
      <Table striped bordered hover responsive className="daily-question-table">
        <thead>
          <tr>
            <th>Išleidimo data</th>
            <th>Klausimas</th>
            <th>Taškai</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {displayedQuestions.map((question, index) => (
            <tr key={index}>
              <td>{new Date(question.dateToRelease.toString()).toLocaleDateString()}</td>
              <td>{question.question}</td>
              <td>{question.points}</td>
              <td>
                <Button
                  className="custom-delete-button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Ištrinti
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination-container">
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? 'primary' : 'light'}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {showFormModal &&
        <QuestionFormModal
          show={showFormModal}
          onHide={handleFormModalClose}
          onSubmit={handleSubmit}
        />
      }

    </div>
  );
};

export default DailyQuestionTable;