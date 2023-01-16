// npm i -D typescript ts-node nodemon
// tsc --init
//     "emitDecoratorMetadata": true,
//     "experimentalDecorators": true

// npm i express dotenv cookie-parser
// npm i -D @types/express @types/node @types/cookie-parser

// npm i --save typeorm reflect-metadata pg

/*** Auth stuff:
 * npm i bcryptjs jsonwebtoken cookie-parser
 * npm i -D @types/bcryptjs @types/jsonwebtoken @types/cookie-parser
 ***/

import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/config/config.env" });

import express, { Express } from "express";
import cookieParser from "cookie-parser";
import path from "path";

import { DataSource } from "typeorm";

import { errorHandler } from "./middleware/errorHandler";

import "reflect-metadata";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.DATABASE,
  entities: [],
  subscribers: [],
  logging: false,
  // Turn this to false in production:
  synchronize: true,
});

// Route files:
import { router as authRouter } from "./routes/auth.routes";

// Initialize DB:
AppDataSource.initialize()
  .then(async (conn) => {
    // await conn.query("CREATE DATABASE IF NOT EXISTS");
    console.log("Successfully connected to Database!");
  })
  .catch((err) => console.log(err));

// Initialize Express App:
const PORT: string = process.env.port;
const app: Express = express();

// Express Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Routers:
app.use("/api/v1/auth", authRouter);

// Use Error Handler:
app.use(errorHandler);

// Listening on a specific port:
app.listen(PORT || 3000, () => {
  console.log(`Listening on port: ${PORT}`);
});
