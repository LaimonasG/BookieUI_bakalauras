import React, { Component, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import BookForm from "./Unfinished books/BookForm";
import { UnfinBookList } from "./Unfinished books/BookList";
import { FinBookList } from "./Finished books/BookList";
import { TextList } from "./Texts/TextList";
import './styles.css';

class Content extends Component {
    render() {
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