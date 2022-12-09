import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import BookForm from "./BookForm";
import { addBook } from "../requests/genres";

export interface IBooks {
    id: number
    GenreId: number
     UserId:string
     Name:string
     Author:string
  }

class AdminBooks extends Component {
    state = {
        isOpen: false,
        books: [  
            {
                Name:"book name",
                Author:"book author"
            }              
        ],
      //  roles: null,
    };

    toggleFormStatus = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    };

    

    onBookChange = (book? : React.ChangeEventHandler<HTMLInputElement>) => {

    };

    render() {
        const { 
            isOpen,
            books, 
            //roles,
        } = this.state;

        return (
            <div>
                <h2>Prižiūrimieji</h2>
                <Button onClick={this.toggleFormStatus} className='btn'>
                    Add Book
                </Button>

                <Button onClick={this.toggleFormStatus} className='btn'>
                    Delete Book
                </Button>
                
                <hr/>
                
                 <Modal show={isOpen} onHide={this.toggleFormStatus}>
                    <Modal.Header closeButton>
                        <Modal.Title> Add New Book </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <BookForm 
                            onBookChange={this.onBookChange}
                            toggleModal={this.toggleFormStatus}
                            //roles={roles}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        )

    }
}


export default AdminBooks;