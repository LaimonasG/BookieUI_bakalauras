
import React, { Component, useEffect, useState } from 'react';
import { getAllBooks } from "../requests/genres";
export interface IBook {
    id: number,
    "name": string,
    "genreID": number,
    "author": string,
    "created": string
}
export const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([])

    async function KeksasGejus() {
        // eslint-disable-next-line no-restricted-globals
        const xd = await   getAllBooks(parseInt(location.pathname.substring(1).split('/')[1]));

        setBooks(xd);
        console.log(xd);
      }
    useEffect(() => {
        KeksasGejus();

      }, []);

      if (books.length === 0) {
        return <h1>loading</h1>;
      }
    return (
        <div className="mt-5 d-flex w-100">
          <table className='w-100'>
                  {books.map((x, index) => (
          <tr key={index} >
            <td style={{ color: 'black' }}>{x.name}</td>
            <td style={{ color: 'black' }}>{x.author}</td>
            <td style={{ color: 'black' }}>{x.created.substring(0,10)}</td>
          </tr>
        ))}
        </table>
        </div>
    )
}