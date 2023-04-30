import React, { useState, useEffect } from 'react';
import './DailyQuestion.css';
import { IAnswer, IQuestion, IAnsweredQuestionDto, handleConfirmed, handleDenied } from '../../Interfaces';
import { getTodaysQuestion, getLastAnswerTime, answerQuestion } from '../../requests/ProfileController'
import { toast } from "react-toastify";

interface DailyQuestionProps {
  onQuestionAnswered: () => void;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ onQuestionAnswered }) => {
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [question, setQuestion] = useState<IQuestion | null>();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lastAnswerTime, setLastAnswerTime] = useState<Date>();
  const [timeUntilNextQuestion, setTimeUntilNextQuestion] = useState(0);

  const handleSubmit = async () => {
    setQuestionAnswered(true);
    const result = await answerQuestion(question!.id, selectedAnswer!);
    if (result.correct === 1) {
      handleConfirmed(result.content);
      onQuestionAnswered();
    } else {
      handleDenied(result.content);
    }

  };

  useEffect(() => {
    GetQuestion();
    GetLastAnswerTime();
  }, []);

  async function GetQuestion() {
    const currentDate = new Date();
    const fullDate = currentDate.toISOString();
    const xd = await getTodaysQuestion(fullDate);
    setQuestion(xd);
  }

  async function GetLastAnswerTime() {
    const xd = await getLastAnswerTime();
    setLastAnswerTime(new Date("2023-04-25T15:00:00"));
  }

  useEffect(() => {
    if (lastAnswerTime) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const nextQuestionTime = new Date(lastAnswerTime);
        nextQuestionTime.setHours(nextQuestionTime.getHours() + 24);

        const timeRemaining = Math.max(0, nextQuestionTime.getTime() - now.getTime());
        setTimeUntilNextQuestion(timeRemaining);

        if (timeRemaining === 0) {
          setQuestionAnswered(false);
          GetQuestion();
        }
      };

      const intervalId = setInterval(updateTimeRemaining, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [lastAnswerTime]);

  const renderDailyQuestion = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (
      questionAnswered ||
      (lastAnswerTime && new Date(lastAnswerTime) >= startOfDay)
    ) {
      const hours = Math.floor(timeUntilNextQuestion / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeUntilNextQuestion % (1000 * 60 * 60)) / (1000 * 60)
      );

      return (
        <div className="countdown">
          <p>Šiandien klausimas jau buvo atsakytas.</p>
          <p>
            Iki kito klausimo liko: {hours}h {minutes}m
          </p>
        </div>
      );
    }

    if (!question) {
      return (<div><p>Dienos klausimas dar nebuvo sugalvotas.</p></div>)
    } else {
      return (
        <div>
          <p>{question?.question}</p>
          <div className="answer-grid">
            {question?.answers.map((answer) => (
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
          </div>
          <button onClick={handleSubmit}>Pateikti</button>
        </div>
      );
    }
  };

  return (
    <div className="daily-question-panel">
      {renderDailyQuestion()}
    </div>
  );
};

export default DailyQuestion;