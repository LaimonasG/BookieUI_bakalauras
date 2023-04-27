import React, { useState, useEffect } from 'react';
import './DailyQuestion.css';
import { IAnswer, IQuestion } from '../../Interfaces';
import { getTodaysQuestion, getLastAnswerTime, answerQuestion } from '../../requests/ProfileController'

const DailyQuestion: React.FC = () => {
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [question, setQuestion] = useState<IQuestion>();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lastAnswerTime, setLastAnswerTime] = useState<number | null>(null);
  const [timeUntilNextQuestion, setTimeUntilNextQuestion] = useState(0); // milliseconds

  // A mock question with answers
  const dailyQuestion = "What is the capital of France?";
  const answers: IAnswer[] = [
    { id: 1, content: "London", correct: 0, questionId: 1 },
    { id: 2, content: "Paris", correct: 1, questionId: 1 },
    { id: 3, content: "Berlin", correct: 0, questionId: 1 },
    { id: 4, content: "Rome", correct: 0, questionId: 1 },
  ];

  const handleSubmit = () => {
    setQuestionAnswered(true);
    // Submit the answer and handle the response
  };

  async function GetQuestion() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const fullDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const xd = await getTodaysQuestion(fullDate);
    setQuestion(xd);
  }

  async function GetLastAnswerTime() {
    const xd = await getLastAnswerTime();
    setQuestion(xd);
  }


  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const endDate = new Date(2023, 3, 28, 1, 20, 0, 0);
      const timeRemaining = Math.max(0, endDate.getTime() - now.getTime());
      setTimeUntilNextQuestion(timeRemaining);
    };

    const intervalId = setInterval(updateTimeRemaining, 1000);
    GetQuestion();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const renderDailyQuestion = () => {
    if (questionAnswered) {
      const hours = Math.floor(timeUntilNextQuestion / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNextQuestion % (1000 * 60 * 60)) / (1000 * 60));

      return (
        <div className="countdown">
          <p>You have already answered today's question.</p>
          <p>Time left: {hours}h {minutes}m</p>
        </div>
      );
    }

    return (
      <div>
        <p>{dailyQuestion}</p>
        {answers.map((answer) => (
          <div key={answer.id}>
            <label htmlFor={`answer-${answer.id}`}>
              <input
                type="radio"
                name="daily-question"
                id={`answer-${answer.id}`}
                value={answer.id}
                onChange={() => setSelectedAnswer(answer.id)}
              />
              <div className="custom-radio"></div>
              {answer.content}
            </label>
          </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  };

  return (
    <div className="daily-question-panel">
      {renderDailyQuestion()}
    </div>
  );
};

export default DailyQuestion;