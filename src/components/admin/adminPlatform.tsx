import React, { useState, useEffect } from 'react';
import { Pagination, Modal, Button, Form, Table } from 'react-bootstrap';
import './adminPlatform.css';
import { getAllQuestions, getAllUsers, setUserPoints, updateBlockedStatus } from '../../requests/AdminController';
import { IQuestion, IUser } from '../../Interfaces';
import DailyQuestionTable from './DailyQuestionTable';

const ITEMS_PER_PAGE = 10;

const AdminPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [currentTextPage, setCurrentTextPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);



  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getAllUsers();
      console.log("Users", data);
      setUsers(data);
    };

    fetchUserData();
  }, [currentUserPage]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const xd = await getAllQuestions();
      console.log("klausimai", xd)
      setQuestions(xd);
    }
    fetchQuestions();
  }, []);

  const handleBlockedStatus = async (userId: string, userName: string, email: string, isBlocked: number, points: number) => {
    const data: IUser = {
      id: userId,
      userName: userName,
      email: email,
      isBlocked: isBlocked,
      points: points
    }
    await updateBlockedStatus(data);
  };

  const handleUpdatePoints = async (userId: string, userName: string, email: string, isBlocked: number, points: number) => {
    const data: IUser = {
      id: userId,
      userName: userName,
      email: email,
      isBlocked: isBlocked,
      points: points
    }
    await setUserPoints(data);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleShowModal = (user: IUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleStatus = () => {
    if (selectedUser) {
      handleBlockedStatus(selectedUser.id, selectedUser.userName, selectedUser.email, selectedUser.isBlocked, selectedUser.points);
      setSelectedUser({ ...selectedUser, isBlocked: 1 - selectedUser.isBlocked });
    }
  };

  return (
    <div className="admin-page">
      <Table striped bordered hover responsive className="user-table">
        <thead>
          <tr>
            <th>Naudotojo vardas</th>
            <th>Taškai</th>
            <th>Užblokuotas</th>
            <th>Taškų pakeitimas</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.points}</td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isBlocked === 1}
                  onChange={() => handleBlockedStatus(user.id, user.userName, user.email, 1 - user.isBlocked, user.points)}
                />
              </td>
              <td>
                <button onClick={() => handleUpdatePoints(user.id, user.userName, user.email, user.isBlocked, user.points)}>Update Points</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DailyQuestionTable dailyQuestions={questions} />
      {/* Add tables for books and texts here */}
      {/* ... */}
      {/* Pagination and Modal code */}
    </div>
  );
};


export default AdminPage;