import { useEffect, useState, ChangeEvent } from "react";
import { Form, Button } from 'react-bootstrap';
import { addBook,editBook } from "../../requests/genres";
import { messageHandling } from '../extra/MessageHandling';


export interface IBooks {
  id: number
  GenreId: number
   UserId:string
   Name:string
   Author:string
}

type Props = {
  bookData?: IBooks,
  onBookChange: (book : React.ChangeEventHandler<HTMLInputElement>) => void,
  toggleModal: () => void
}

type MessageProps = {
  success: string,
  message:string
}
const BookForm = (props : Props) => {

    const {bookData,onBookChange,toggleModal} = props;

    const [book, setBook] = useState<IBooks>({
      id: 0,
      GenreId: 0,
      UserId:"",
      Name:"",
      Author:""
    });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log('event target ',event.target);
        if(name == 'name')
          book.Name=value;

          if(name == 'Author')
          book.Author=value;
        
    };

    // const handleSetImage = (event: ChangeEvent<HTMLInputElement>, index: number) {
    // //   const { files } = event.target;
    // //   setSelectedImage(files[0]);
    //  }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let result = null;
        const genreId = localStorage.getItem("genreId");
        if (bookData) {
          const obj={method:"succeess",errorMessage:"Successfuly updated user"};
            result = await editBook(1,bookData.id, book!);
            messageHandling(obj);
        } else {
          const obj={method:"succeess",errorMessage:"Successfuly added new user"};
          console.log('genre: ',genreId);
            result = await addBook(parseInt(genreId!),book!);
            messageHandling(obj);
        }
        toggleModal();
      //  onBookChange(result.bookData);
    };

    return (
        <Form onSubmit={onSubmit}>

            <Form.Group>
                <Form.Label className="names">Name</Form.Label>
                <Form.Control
                    name="name"
                    onChange={onChange}
                    //value={book!.Name}
                    defaultValue=""
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label className="names">Author</Form.Label>
                <Form.Control
                    name="Author"
                    onChange={onChange}
                   // value={book!.Author}
                   defaultValue=""
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" >
                {bookData ? "Update" : "Add" }
            </Button>
        </Form>
    )
    }

export default BookForm;