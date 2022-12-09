
import React, { Component } from 'react';
import { BookList } from 'component/BookList';

export class Books extends Component {

    render() {
        return (
            <div className="mt-5 d-flex justify-content-left">
                This is book list page.
                <BookList />
            </div>

        )
    }
}