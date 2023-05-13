import React, { Component } from "react";
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
                <div className="booklist-wrapper">
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