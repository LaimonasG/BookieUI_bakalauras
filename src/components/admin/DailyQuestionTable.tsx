import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { IQuestion } from '../../Interfaces';


type DailyQuestionTableProps = {
  dailyQuestions: IQuestion[];
};

const DailyQuestionTable: React.FC<DailyQuestionTableProps> = ({ dailyQuestions }) => {
  return (
    <div className="daily-question-table-container">
      <div className="table-header">
        <h2>Dienos klausimas</h2>
        <Button>Pridėti klausimą</Button>
      </div>
      <Table striped bordered hover responsive className="daily-question-table">
        <thead>
          <tr>
            <th>Išleidimo data</th>
            <th>Klausimas</th>
            <th>Taškai</th>
          </tr>
        </thead>
        <tbody>
          {dailyQuestions.map((question, index) => (
            <tr key={index}>
              <td>{new Date(question.dateToRelease.toString()).toLocaleString()}</td>
              <td>{question.question}</td>
              <td>{question.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DailyQuestionTable;