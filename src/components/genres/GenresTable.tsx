import { useEffect, useState } from "react";
import { getAllGenres } from "../../requests/GenresController";
import { IGenres } from '../../Interfaces';
import './styles.css';


export const GenresTable = () => {
  const [genres, setGenres] = useState<IGenres[]>([]);

  async function GetGenres() {
    const xd = await getAllGenres();
    setGenres(xd);
  }

  useEffect(() => {
    GetGenres();
  }, []);


  if (genres.length === 0) {
    return <h1>loading</h1>;
  }

  const rows: JSX.Element[] = [];

  for (let i = 0; i < genres.length; i += 3) {
    const row: JSX.Element[] = [];

    for (let j = i; j < i + 3 && j < genres.length; j++) {
      const genre = genres[j];

      row.push(
        <a
          href="contents/*"
          key={genre.id}
          onClick={() => {
            localStorage.setItem("genreName", genre.name);
          }}
          className="genre-tile d-flex flex-column align-items-center justify-content-center"
        >
          <img src={`/GenreImages/${genre.name}.png`} alt={genre.name} />
          <span className="genre-name">{genre.name}</span>
        </a>
      );
    }

    rows.push(<div className="genre-row">{row}</div>);
  }

  return (
    <div id="container">
      {rows}
    </div>
  );
};