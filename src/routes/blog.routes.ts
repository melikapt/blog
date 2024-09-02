import express from 'express';
import { BlogController } from '../controllers/BlogController/blog.controller'
import { authenticate } from '../middleware/auth.middleware';
import {checkUser} from '../middleware/checkUser.middleware';
const Router = express.Router();

Router.post('/', authenticate,checkUser, BlogController.createBlog)
Router.put('/like-blog/:id', authenticate,checkUser, BlogController.likeBlog)
Router.get('/get-blogs', BlogController.getBlogs)
Router.get('/get-own-blogs', authenticate,checkUser, BlogController.getOwnBlogs)

export { Router as blogRouter };