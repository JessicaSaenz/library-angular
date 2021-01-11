import { Book } from './book';

export class Category {
    id: number;
    name: string;
    description: string;
    books: Book[];
}
