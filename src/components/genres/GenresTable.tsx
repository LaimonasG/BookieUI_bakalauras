import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getAllGenres } from "../../requests/genres";
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
  return (
    <div id="container">
      <table className="w-25">
        <tbody>
          {genres.map((x, index) => (
            <tr key={index}>
              <td>
                <a href="books/index">
                <button onClick={() => {localStorage.setItem("genreId",index.toString()); localStorage.setItem("genreName",x.name)}} type="button" className="btn bg-transparent text-black">
                   {x.name}
                </button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  );
};
