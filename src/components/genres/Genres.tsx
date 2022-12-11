
import React, { Component } from 'react';
import { GenresTable } from './GenresTable';

export class Genres extends Component {

    render() {
        return (
            <div className="mt-5 d-flex w-100 justify-content-left">
                <GenresTable />
            </div>
        )
    }


}