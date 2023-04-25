import { useEffect, useState, ChangeEvent } from "react";
import { getComments } from "../../requests/GenresController";


export interface IBooks {
  id: number
  GenreId: number
  UserId: string
  Name: string
  Author: string
  Price: number
  Quality: string
}

export interface IComments {
  username: string,
  userId: string,
  id: number,
  bookID: number,
  text: string
}

type Props = {
  toggleModal: (bookId: number) => void
  bookId: number
}

const Comments = (props: Props) => {

  const { bookId, toggleModal } = props;

  const [comments, setComments] = useState<IComments[]>([]);

  async function GetComments() {
    const xd = await getComments(parseInt(localStorage.getItem("genreId")!), bookId);
    console.log('initial value: ', xd);
    setComments(xd);
    console.log('set value: ', comments);
  }

  useEffect(() => {
    GetComments();
  }, []);

  if (comments.length == 0)
    return <h1>No comments added yet</h1>;

  return (

    <div>
      <table className='w-100 d-flex justify-content-center'>
        <tbody>
          <tr id="header" className='bg-blue'>
            <td style={{ width: 100 }}>Username</td>
            <td >Comment</td>
          </tr>
          {comments.map((x, index) => (
            <tr key={index} >
              <td style={{ color: 'black', width: 400 }}>{x.username}</td>
              <td style={{ color: 'black' }}>{x.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Comments;