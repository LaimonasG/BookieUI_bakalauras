import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './EditPersonalInfo.css';
import { IProfile } from '../../Interfaces';

interface IUpdatePersonalInfoModalProps {
  show: boolean;
  currentUser: IProfile | undefined;
  onHide: () => void;
  onUpdate: (userName: string, name: string, surname: string, email: string) => void;
}

const UpdatePersonalInfoModal: React.FC<IUpdatePersonalInfoModalProps> = ({ show, currentUser, onHide, onUpdate }) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [surname, setSurname] = useState(currentUser?.surname || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(currentUser?.userName || '');

  const handleSubmit = () => {
    onUpdate(username, name, surname, email);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Keisti asmeninę informaciją</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="username">
            <Form.Label>Naudotojo vardas</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="name">
            <Form.Label>Vardas</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="surname">
            <Form.Label>Pavardė</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Elektroninis paštas</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Atšaukti
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Pateikti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdatePersonalInfoModal;