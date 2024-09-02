import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { Users } from './User.entity';
import {
    MinLength,
    MaxLength,
    IsString,
    IsDate
} from 'class-validator';


@Entity()
export class Blogs {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({ nullable: false, })
    @MinLength(3)
    @MaxLength(50)
    @IsString()
    title: string

    @Column({ nullable: false, })
    @MinLength(20)
    @MaxLength(3000)
    @IsString()
    description: string

    @Column({
        default: true
    })
    isPublished: boolean

    @Column({
        type: 'int',
        default: 0
    })
    numberOfLikes: number

    @Column('timestamp')
    @IsDate()
    createdAt: Date

    @ManyToOne(() => Users, (user) => user.blogs)
    @JoinColumn({
        name: 'author_id',
        referencedColumnName: 'id'
    })
    user: Users

    @ManyToMany(() => Users, (user) => user.blogsLike, { cascade: true })
    usersLike: Users[]
}