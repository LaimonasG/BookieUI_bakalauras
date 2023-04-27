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

export interface IBookAdd {
  name: string
  description: string
  chapterPrice: string
  bookPrice: string
  coverImage: File
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
id:number
bookId:number
userId:string
name:string
content:string
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

export function getPointsWord(points: number) {
  if (points % 10 === 1 && points % 100 !== 11) {
    return "taškas";
  } else if (points % 10 >= 2 && points % 10 <= 9 && (points % 100 < 10 || points % 100 >= 20)) {
    return "taškai";
  } else {
    return "taškų";
  }
}