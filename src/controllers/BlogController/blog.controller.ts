import { Request, Response } from 'express';
import { Blogs } from '../../entities/Blog.entity';
import { Users } from '../../entities/User.entity';
import { validate } from 'class-validator';
import { dataSource } from '../../data-source';
import _ from 'lodash';
const blogRepository = dataSource.getRepository('Blogs');
const userRepository = dataSource.getRepository('Users');


export class BlogController {
    static async createBlog(req: Request, res: Response) {
        try {
            console.log('oomad too');
            
            const { title, description } = req.body;
            if (title === '' || title === undefined || description === '' || description === undefined) {
                return res.status(422).send('Fields are required!');
            }

            const blog = new Blogs()
            blog.title = title;
            blog.description = description;
            blog.createdAt = new Date(Date.now());
            blog.user = req.user;

            const error = await validate(blog);
            if (error.length > 0) {
                return res.status(422).send(error[0].constraints);
            }

            await dataSource.createQueryBuilder()
                .insert()
                .into(Blogs)
                .values(blog)
                .execute()

            return res.status(200).send({ message: 'Blog created successfully', blog: _.pick(blog, ['title', 'isPublished']) });

        } catch (error) {
            return res.status(500).send(error);
        }
    }

    static async likeBlog(req: Request, res: Response) {
        try {
            let user = req.user;

            const blog = await blogRepository.findOne({
                where: {
                    id: req.params.id
                }
            })
            if (!blog) return res.status(404).send('The desired blog does not exist');

            await dataSource.createQueryBuilder()
                .update(Blogs)
                .set({ numberOfLikes: blog.numberOfLikes + 1 })
                .where({
                    id: req.params.id
                })
                .execute()

            await dataSource
                .createQueryBuilder()
                .relation(Users, "blogsLike")
                .of(user)
                .add(blog)

            // user = await userRepository.findOne({
            //     where: {
            //         id: user.id
            //     },
            //     relations: {
            //         blogsLike: true
            //     }
            // })

            // user.blogsLike.push(blog)
            // await userRepository.save(user);

            return res.status(200).send(_.pick(blog, ['title', 'numberOfLikes']));

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }

    static async getBlogs(req: Request, res: Response) {
        try {
            const blogs = await blogRepository.find({
                where: {
                    isPublished: true
                },
                select: ['title', 'description', 'numberOfLikes']
            })
            if (!blogs) return res.status(404).send('There is no blogs.')

            return res.status(200).send(blogs);
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    static async getOwnBlogs(req: Request, res: Response) {
        try {
            const blogs = await blogRepository.find({
                where: {
                    user: { id: req.user.id }
                }
            });
            if (blogs.length === 0) return res.status(404).send('You do not publish any blogs');

            return res.status(200).send(blogs);

        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
}