import React, { useState, useEffect } from 'react';
import './DailyQuestion.css';
import { IQuestion, handleConfirmed, handleDenied, useHandleAxiosError } from '../../Interfaces';
import { getTodaysQuestion, getLastAnswerTime, answerQuestion } from '../../requests/ProfileController'
import { AxiosError } from 'axios';
import { getUserBlockedStatus } from '../../requests/AdminController';

interface DailyQuestionProps {
  onQuestionAnswered: () => void;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ onQuestionAnswered }) => {
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [question, setQuestion] = useState<IQuestion>();
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [lastAnswerTime, setLastAnswerTime] = useState<Date>();
  const [timeUntilNextQuestion, setTimeUntilNextQuestion] = useState(0);
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);


  const handleAxiosError = useHandleAxiosError();


  const handleSubmit = async () => {
    if (!selectedAnswer) {
      return;
    }
    setQuestionAnswered(true);
    if (question) {
      try {
        const result = await answerQuestion(question.id, selectedAnswer);
        if (result.correct === 1) {
          handleConfirmed(`Puiku! Jūsų pasirinkimas "${result.content}" yra teisingas.`);
          onQuestionAnswered();
        } else {
          handleDenied(`Deja, jūsų pasirinkimas buvo neteisingas. Teisingas variantas yra "${result.content}".`);
        }
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    }
  };

  useEffect(() => {
    GetQuestion();
    GetLastAnswerTime();
    SetUserBlockedStatus();
  }, []);

  async function GetQuestion() {
    const currentDate = new Date();
    const fullDate = currentDate.toISOString();
    const xd = await getTodaysQuestion(fullDate);
    setQuestion(xd);
  }

  async function SetUserBlockedStatus() {
    const isBlocked = await getUserBlockedStatus();
    setIsUserBlocked(isBlocked);
  }

  async function GetLastAnswerTime() {
    await getLastAnswerTime();
    setLastAnswerTime(new Date("2023-04-25T15:00:00")); //date set just for testing purposes
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

    if (isUserBlocked) {
      return (<div><p>Naudotojui šis funkcionalumas uždraustas</p></div>)
    } else if (!question) {
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
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === -1}
          >
            Pateikti
          </button>
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