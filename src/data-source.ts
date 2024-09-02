import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import dotenv from 'dotenv';
import { Blogs } from './entities/Blog.entity';
import { Users } from './entities/User.entity';
dotenv.config();
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT);
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;


const options: DataSourceOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'blog',
    synchronize: true,
    logging: true,
    entities: [Blogs, Users]
};


export default (async () => {
    await createDatabase({ ifNotExist: true, options });
})();

export const dataSource = new DataSource(options);
// dataSource.initialize()
//     .then(() => {
//         console.log(`Connected to ${options.database} database on ${options.host}`);

//     })
//     .catch(error => console.log(error))





