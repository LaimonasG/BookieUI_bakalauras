import React, { useState, useEffect } from 'react';
import './DailyQuestion.css';
import { IAnswer, IQuestion, IAnsweredQuestionDto } from '../../Interfaces';
import { getTodaysQuestion, getLastAnswerTime, answerQuestion } from '../../requests/ProfileController'
import { toast } from "react-toastify";

const DailyQuestion: React.FC = () => {
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [question, setQuestion] = useState<IQuestion | null>();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lastAnswerTime, setLastAnswerTime] = useState<Date>();
  const [timeUntilNextQuestion, setTimeUntilNextQuestion] = useState(0);

  const handleSubmit = async () => {
    setQuestionAnswered(true);
    console.log("question", question!.id);
    console.log("answer", selectedAnswer!);
    const result = await answerQuestion(question!.id, selectedAnswer!);
    console.log("aaaa", result);
    if (result.isCorrect == 1)
      handleAnsweredCorrectly(result.content); else
      handleAnsweredInCorrectly(result.content);
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
    setLastAnswerTime(new Date("0001-01-01T00:00:00"));
  }

  useEffect(() => {
    if (lastAnswerTime) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const nextQuestionTime = new Date(lastAnswerTime);
        nextQuestionTime.setHours(nextQuestionTime.getHours() + 24);

        const timeRemaining = Math.max(0, nextQuestionTime.getTime() - now.getTime());
        setTimeUntilNextQuestion(timeRemaining);
      };

      const intervalId = setInterval(updateTimeRemaining, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [lastAnswerTime]);

  function handleAnsweredCorrectly(answer: string) {
    toast.success(`Klausimas atsakytas teisingai! Teisingas atsakymas: ${answer}`, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function handleAnsweredInCorrectly(answer: string) {
    toast.error(`Klausimas atsakytas neteisingai! Teisingas atsakymas: ${answer}`, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

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