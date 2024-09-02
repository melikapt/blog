import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany,JoinTable } from 'typeorm';
import { Blogs } from './Blog.entity';
import {
    MinLength,
    MaxLength,
    IsString,
    IsEmail,
    IsDate
} from 'class-validator';

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({nullable:false,})
    @MinLength(3)
    @MaxLength(50)
    @IsString()
    first_name: string

    @Column({nullable:false,})
    @MinLength(3)
    @MaxLength(50)
    @IsString()
    last_name: string

    @Column({nullable:false,})
    @MinLength(2)
    @MaxLength(20)
    @IsString()
    username: string

    @Column({
        type:'varchar',
        nullable:false,
        unique: true
    })
    @IsEmail()
    email: string

    @Column({nullable:false,})
    @MinLength(6)
    @MaxLength(50)
    @IsString()
    password: string

    @Column('timestamp')
    @IsDate()
    createdAt: Date

    @OneToMany(() => Blogs, (blog) => blog.user)
    blogs: Blogs[]

    @ManyToMany(() => Blogs, (blog) => blog.usersLike)
    @JoinTable({
        name:'User-Like-Blog'
    })
    blogsLike: Blogs[]
}