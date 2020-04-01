import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReadBookDto, CreateBookDto, UpdateBookDto } from './dto';
import { StatusConfig } from '../../shared/config.status';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { plainToClass } from 'class-transformer';
import { User } from '../user/user.entity';
import { Book } from './book.entity';
import { In } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UpdateRoleDto } from '../role/dto';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookRepository) private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository) private readonly _userRepository: UserRepository
    ) { }

    async get(bookId: number): Promise<ReadBookDto> {
        if (!bookId) throw new BadRequestException('No ha Enviado el ID');
        const book: Book = await this._bookRepository.findOne(bookId, { where: { status: StatusConfig.ACTIVO } })
        if (!book) throw new NotFoundException('El Libro no Existe');
        return plainToClass(ReadBookDto, book);
    }

    async getAll(): Promise<ReadBookDto[]> {
        const books: Book[] = await this._bookRepository.find({ where: { status: StatusConfig.ACTIVO } });
        return books.map((book: Book) => plainToClass(ReadBookDto, book));
    }

    async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
        if (!authorId) throw new BadRequestException('No ha Enviado el ID');
        const books: Book[] = await this._bookRepository.find({ where: { status: StatusConfig.ACTIVO, authors: In([authorId]) } });
        return books.map((book: Book) => plainToClass(ReadBookDto, book));
    }

    async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
        const authors: User[] = []

        for (const authorId of book.authors) {

            const authorExists: User = await this._userRepository.findOne(authorId, { where: { status: StatusConfig.ACTIVO } });
            if (!authorExists) throw new NotFoundException(`No Hay un Author con este ID: ${authorId}`);

            const isAuthor: Boolean = authorExists.roles.some((role: Role) => role.name === RoleType.AUTHOR)
            if (!isAuthor) throw new UnauthorizedException(`Este Usuario ${authorId} no es un Author`);

            authors.push(authorExists)
        }

        const savedBook: Book = await this._bookRepository.save({ name: book.name, description: book.description, authors });

        return plainToClass(ReadBookDto, savedBook);
    }

    async createByAuthor(book: Partial<CreateBookDto>, authorId: number): Promise<ReadBookDto> {
        const author: User = await this._userRepository.findOne(authorId, { where: { status: StatusConfig.ACTIVO } });
        const isAuthor: Boolean = author.roles.some((role: Role) => role.name === RoleType.AUTHOR)
        if (!isAuthor) throw new UnauthorizedException(`Este Usuario ${authorId} no es un Author`);
        const savedBook: Book = await this._bookRepository.save({ name: book.name, description: book.description, author });
        return plainToClass(ReadBookDto, savedBook)
    }

    async updateByAuthor(bookId: number, role: Partial<UpdateRoleDto>, authorId: number, ): Promise<ReadBookDto> {
        const bookExists: Book = await this._bookRepository.findOne(bookId, { where: { status: StatusConfig.ACTIVO } });
        if (!bookExists) throw new NotFoundException(`El Book No Existe`);
        const isOwnBook: Boolean = bookExists.authors.some((author: User) => author.id === authorId)
        if (!isOwnBook) throw new UnauthorizedException(`this book isn't the book's authors`);
        const updatedBook = await this._bookRepository.update(bookId, role);
        return plainToClass(ReadBookDto, updatedBook)
    }

    async deleteBook(bookId: number): Promise<void> {
        const bookExists: Book = await this._bookRepository.findOne(bookId, { where: { status: StatusConfig.ACTIVO } });
        if (!bookExists) throw new NotFoundException(`El Book No Existe`);
        const updatedBook = await this._bookRepository.update(bookId, { status: StatusConfig.INACTIVO });
    }
}
