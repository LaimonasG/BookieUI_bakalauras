import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { IStatus, ITextsBought, handleConfirmed, handleDenied, useHandleAxiosError } from "../../Interfaces";
import { getAllTexts, setTextStatus } from "../../requests/AdminController";
import { AxiosError } from "axios";
import TextInfoModal from "./TextInfoModal";

const TextsTable: React.FC = () => {
  const [selectedText, setSelectedText] = useState<ITextsBought | null>(null);
  const [texts, setTexts] = useState<ITextsBought[]>([]);
  const [statusComment, setStatusComment] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<Map<number, number>>(new Map());
  const [readTextShow, setReadTextShow] = useState<boolean>(false);


  //pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const textsPerPage = 5;
  const totalPages = Math.ceil(texts.length / textsPerPage);

  const start = (currentPage - 1) * textsPerPage;
  const end = start + textsPerPage;
  const displayedTexts = texts.slice(start, end);

  const handleAxiosError = useHandleAxiosError();

  const handleReadModalShow = (text: ITextsBought) => {
    setSelectedText(text);
    setReadTextShow(true);
  };

  const handleReadModalHide = () => {
    setReadTextShow(false);
  };

  const isUpdateDisabled = (textId: number) => {
    const currentStatus = selectedStatuses.get(textId);
    return currentStatus === IStatus.Pateikta || currentStatus === undefined;
  };


  useEffect(() => {
    async function fetchData() {
      const texts = await getAllTexts();
      console.log()
      setTexts(texts);
    }

    fetchData();
  }, []);

  const handleStatusChange = (textId: number, newStatus: number) => {
    setSelectedStatuses((prevState) => {
      const updatedStatuses = new Map(prevState);
      updatedStatuses.set(textId, newStatus);
      return updatedStatuses;
    });
  };

  const submitStatusChange = async (text: ITextsBought) => {

    const currentStatus = selectedStatuses.get(text.id);
    if (currentStatus !== null) {
      try {
        const response = await setTextStatus(currentStatus!, statusComment, text.id);
        if (response === 'success') {
          handleConfirmed(`Teksto "${text.name}" statusas pakeistas į "${getStatusString(currentStatus as number)}"`);
          const texts = await getAllTexts();
          setTexts(texts);
        } else {
          handleDenied(response);
        }
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusString = (statusNumber: number) => {
    return IStatus[statusNumber];
  };

  return (
    <div className="text-table-container">
      <div className="table-header">
        <h2>Tekstai</h2>
      </div>

      <Table striped bordered hover responsive className="text-table">
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th>Autorius</th>
            <th>Būsena</th>
            <th>Komentaras</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {displayedTexts.map((text) => (
            <tr key={text.id}>
              <td>{text.name}</td>
              <td>{text.author}</td>
              <td>
                <Form.Select
                  aria-label="Pasirinkite statusą"
                  value={selectedStatuses.get(text.id) ?? text.status}
                  onChange={(event) =>
                    handleStatusChange(text.id, parseInt(event.target.value, 10))
                  }
                >
                  {Object.values(IStatus)
                    .filter((value) => typeof value === 'number')
                    .map((status) => (
                      <option key={status} value={status}>
                        {getStatusString(status as number)}
                      </option>
                    ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Įveskite komentarą"
                  onChange={(event) => setStatusComment(event.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => submitStatusChange(text)}
                  disabled={isUpdateDisabled(text.id)}
                >
                  Atnaujinti
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleReadModalShow(text)}
                >
                  Peržiūrėti
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

      {selectedText && readTextShow && (
        <TextInfoModal
          text={selectedText}
          isOpen={readTextShow}
          onClose={handleReadModalHide}
        />
      )}
    </div>
  );
};

export default TextsTable;
