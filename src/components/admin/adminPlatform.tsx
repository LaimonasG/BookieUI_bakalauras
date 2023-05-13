import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import './adminPlatform.css';
import { getAllUsers, setUserPoints, updateBlockedStatus } from '../../requests/AdminController';
import { IUser, handleConfirmed, handleDenied, useHandleAxiosError } from '../../Interfaces';
import DailyQuestionTable from './DailyQuestionTable';
import { AxiosError } from 'axios';
import BookTable from './adminBooksTable';
import TextsTable from './adminTextsTable';

const AdminPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pointsInputValues, setPointsInputValues] = useState<Record<string, number>>({});
  const [initialPointsValues, setInitialPointsValues] = useState<Record<string, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});

  //pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const displayedUsers = users.slice(start, end);

  const handleAxiosError = useHandleAxiosError();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);

        const initialCheckedStates = data.reduce<Record<string, boolean>>((acc, user) => {
          acc[user.id] = user.isBlocked === 1;
          return acc;
        }, {});
        setCheckedStates(initialCheckedStates);

      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    };

    fetchUserData();
  }, [useHandleAxiosError]);

  useEffect(() => {
    const initialPointsInputValues = users.reduce<Record<string, number>>((acc, user) => {
      acc[user.id] = user.points;
      return acc;
    }, {});
    setPointsInputValues(initialPointsInputValues);
    setInitialPointsValues(initialPointsInputValues);
  }, [users]);

  const pointsUpdated = (userId: string) => {
    return initialPointsValues[userId] !== pointsInputValues[userId];
  };

  const handleBlockedStatus = async (userId: string, userName: string, email: string, isBlocked: number, points: number) => {
    const data: IUser = {
      id: userId,
      userName: userName,
      email: email,
      isBlocked: isBlocked,
      points: points
    }
    try {
      await updateBlockedStatus(data);
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdatePoints = async (userId: string, userName: string, email: string, isBlocked: number) => {
    const data: IUser = {
      id: userId,
      userName: userName,
      email: email,
      isBlocked: isBlocked,
      points: pointsInputValues[userId] || 0
    };
    try {
      const response = await setUserPoints(data);
      if (response === 'success') {
        handleConfirmed(`Taškai sėkmingai atnaujinti.`);
        const users = await getAllUsers();
        setUsers(users);
      } else {
        handleDenied(response);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    }
  };


  return (
    <div className="admin-page">
      <div className="table-header">
        <h2>Naudotojai</h2>
      </div>
      <Table striped bordered hover responsive className="user-table">
        <thead>
          <tr>
            <th>Naudotojo vardas</th>
            <th>Užblokuotas</th>
            <th>Taškai</th>
            <th>Taškų pakeitimas</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>
                <input
                  type="checkbox"
                  checked={checkedStates[user.id] || false}
                  onChange={() => {
                    setCheckedStates({ ...checkedStates, [user.id]: !checkedStates[user.id] });
                    handleBlockedStatus(user.id, user.userName, user.email, 1 - user.isBlocked, user.points);
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={pointsInputValues[user.id] || ''}
                  onChange={(e) => {
                    setPointsInputValues({ ...pointsInputValues, [user.id]: parseInt(e.target.value) });
                  }}
                />
              </td>
              <td>
                <button
                  className="update-points-button"
                  disabled={!pointsUpdated(user.id)}
                  onClick={() => handleUpdatePoints(user.id, user.userName, user.email, user.isBlocked)}
                >
                  Atnaujinti taškus
                </button>              </td>
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

      <DailyQuestionTable />
      <BookTable />
      <TextsTable />

    </div>
  );
};


export default AdminPage;