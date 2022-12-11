
import React,{Component} from 'react';
import { createBasket,getBasket } from '../../requests/genres';
import { BookList } from '../books/BookList';

export class Basket extends Component{

    render(){
        return(
            <div className="mt-5 d-flex justify-content-left">
                This is Basket page.
            </div>
        )
    }
}