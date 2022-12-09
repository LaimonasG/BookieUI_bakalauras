import { useEffect, useState } from "react";
import { getAllGenres } from "../requests/genres";
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
    <div className="w-25 mx-20">
      <table className="w-25 bg-black">
        <tbody>
          {genres.map((x, index) => (
            <tr key={index}>
              <td>
                <a href="books/${index}">
                <button onClick={() => localStorage.setItem("genreId",index.toString())} className="text-decoration-none text-white bg-black">
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
