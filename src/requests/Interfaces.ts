interface IBookBought {
  Id: number
  Name: string
  Chapters: IChapters
  GenreName: string
  Description: string
  Price: number
  Created: Date
  UserId: string
}

interface ITextsBought {
  Id: number
  Name: string
  GenreName: string
  Content: string
  Price: number
  Created: Date
  UserId: string
}

interface IChapters {
Id:number
BookId:number
UserId:string
Name:string
Content:string
}

interface ITexts {
  Id: number,
  Content: string,
}

interface ISetRoleDto {
  roleName: string
}