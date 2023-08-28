import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv';

dotenv.config();

const source = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + 'entity/*.entity{.ts,.js}'],
  migrations: ['src/migration/*.ts'],
  synchronize: true,
})

export default source