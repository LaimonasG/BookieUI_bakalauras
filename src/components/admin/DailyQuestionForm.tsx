import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './DailyQuestionForm.css';
import { IAnswerAdd, IQuestionAdd } from '../../Interfaces';

interface IQuestionFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (question: IQuestionAdd) => void;
}


const QuestionFormModal: React.FC<IQuestionFormModalProps> = ({ show, onHide, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [points, setPoints] = useState('');
  const [dateToRelease, setDateToRelease] = useState<Date>();
  const [answers, setAnswers] = useState<IAnswerAdd[]>([
    { content: '', correct: 0 },
    { content: '', correct: 0 },
  ]);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = () => {
    if (!question || !points || !dateToRelease || answers.length < 2 || answers.some(a => !a.content)) {
      setValidationError('Visi laukai yra privalomi.');
      return;
    }

    const rez: IQuestionAdd = {
      "question": question,
      "points": parseFloat(points),
      "dateToRelease": dateToRelease,
      "answers": answers
    }

    onSubmit(rez);
    onHide();
  };

  const updateAnswer = (index: number, newText: string, newIsCorrect: number) => {
    const newAnswers = answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, content: newText, correct: newIsCorrect };
      }
      return answer;
    });
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, { content: '', correct: 0 }]);
  };

  const removeAnswer = () => {
    if (answers.length > 2) {
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Suveskite klausimo informaciją</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {validationError && <p className="text-danger">{validationError}</p>}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Pavadinimas</Form.Label>
            <Form.Control
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={150}
            />
          </Form.Group>

          <Form.Group controlId="chapterPrice">
            <Form.Label>Taškai už atsakymą</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="dateToRelease">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              value={dateToRelease?.toISOString().substr(0, 10)}
              onChange={(e) => setDateToRelease(new Date(e.target.value))}
            />
          </Form.Group>

          {answers.map((answer, index) => (
            <Form.Group key={index} controlId={`answer-${index}`}>
              <Form.Label>Atsakymas {index + 1}</Form.Label>
              <Form.Control
                type="text"
                value={answer.content}
                onChange={(e) =>
                  updateAnswer(index, e.target.value, answer.correct)
                }
              />
              <Form.Check
                type="checkbox"
                label="Teisingas atsakymas"
                checked={answer.correct === 1}
                onChange={(e) =>
                  updateAnswer(index, answer.content, e.target.checked ? 1 : 0)
                }
              />

            </Form.Group>

          ))}


        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex align-items-center">
          <Button onClick={addAnswer} variant="primary" className="mt-3">
            Pridėti atsakymą
          </Button>
          <Button onClick={removeAnswer} variant="danger" className="ml-4 mr-4 mt-3" disabled={answers.length <= 2}>
            Pašalinti atsakymą
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="mt-3" style={{ backgroundColor: "var(--color-2)" }}>
            Pateikti
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionFormModal;