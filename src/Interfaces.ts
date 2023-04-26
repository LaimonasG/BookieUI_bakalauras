export interface IBookBought {
  id: number
  name: string
  chapters: IChapters[]
  genreName: string
  description: string
  price: number
  created: Date
  userId: string
  author:string
  isFinished:number
  coverImageUrl:string
}

export interface IBookToBuy {
  id: number
  name: string
  genreName: string
  description: string
  price: number
  created: Date
  userId: string
  author:string
  isFinished:number
  coverImageUrl:string
}

export interface ITextsBought {
  id: number
  name: string
  genreName: string
  content: string
  description:string
  price: number
  created: Date
  userId: string
  coverImageUrl:string
  author:string
}

export interface ITextsToBuy {
  id: number
  name: string
  description:string
  genreName: string
  price: number
  created: Date
  userId: string
  coverImageUrl:string
  author:string
}

export interface IChapters {
Id:number
BookId:number
UserId:string
Name:string
Content:string
}

export interface ITexts {
  Id: number,
  Content: string,
}

export interface ISetRoleDto {
  roleName: string
}

export interface MyToken {
  name: string;
  exp: number;
  sub: string;
}