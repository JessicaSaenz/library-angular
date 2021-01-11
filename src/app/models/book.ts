import { Category } from './category';

export class Book {
    id: number;
    cover: string;
    name: string;
    author: string;
    categories_id : number;
    category: Category;
    publication: Date;
    status: boolean;
    borrow_user:string;
}

