import express from 'express';
import "reflect-metadata";
import dotenv from 'dotenv';
import { dataSource } from './data-source';
import {authRouter} from './routes/auth.routes';
import {blogRouter} from './routes/blog.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/',authRouter);
app.use('/blogs',blogRouter);


const SERVER_PORT = process.env.SERVER_PORT;//process.env.PORT || 3000;

dataSource.initialize()
    .then(() => {
        console.log(`Connected to ${dataSource.options.database} database`);

    })
    .catch(error => console.log(error))


app.listen(SERVER_PORT, () => {
    console.log(`connected on port ${SERVER_PORT}...`);

})