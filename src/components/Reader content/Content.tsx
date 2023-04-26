import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import BookForm from "./Unfinished books/BookForm";
import { UnfinBookList } from "./Unfinished books/BookList";
import { FinBookList } from "./Finished books/BookList";
import { TextList } from "./Texts/TextList";

class Content extends Component {
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
            <div className="content-container">
                <div className="booklist-wrapper">
                    <FinBookList />
                </div>
                <div className="textlist-wrapper">
                    <UnfinBookList />
                </div>
                <div className="textlist-wrapper">
                    <TextList />
                </div>
            </div>
        );

    }
}


export default Content;