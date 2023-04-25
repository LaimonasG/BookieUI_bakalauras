import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import BookForm from "./BookForm";
import { BookList } from "./BookList";

interface IBooks {
    id: number
    GenreId: number
    UserId: string
    Name: string
    Author: string
}

class Books extends Component {
    state = {
        isOpen: false,
        books: [
            {
                Name: "book name",
                Author: "book author"
            }
        ],
    };

    toggleFormStatus = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    };

    onBookChange = (book?: React.ChangeEventHandler<HTMLInputElement>) => {

    };

    render() {
        const {
            isOpen,
            books,
        } = this.state;


        return (
            <div >
                {/* <Button onClick={this.toggleFormStatus} className='btn'>
                    Add Book
                </Button> */}

                <div className="d-flex justify-content-center">
                    <BookList />
                </div>


                {/* <Modal show={isOpen} onHide={this.toggleFormStatus}>
                    <Modal.Header closeButton>
                        <Modal.Title> Add New Book </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <BookForm
                            onBookChange={this.onBookChange}
                            toggleModal={this.toggleFormStatus}
                        />
                    </Modal.Body>
                </Modal> */}
            </div>
        )

    }
}


export default Books;