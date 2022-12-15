import jwt_decode from "jwt-decode";
import React,{Component} from 'react';

// interface MyToken {
//     name: string;
//     exp: number;
//     sub:string;
//   }

// var userStr = localStorage.getItem("user");
// let user=null;
// if(userStr)
// {
//     user=JSON.parse(userStr);
//     var decodedToken = jwt_decode<MyToken>(user.accessToken);
// }

export class Home extends Component{
    
    render(){
        return(
            <div className="mt-5 d-flex justify-content-left">
            </div>
        )
    }
}