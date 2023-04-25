import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getAllGenres } from "../../requests/GenresController";
import './styles.css';

export interface IGenres {
  id: number;
  name: string;
}

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
          href="turinys/index"
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