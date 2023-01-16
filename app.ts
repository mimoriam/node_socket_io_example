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

// npm i class-transformer class-validator cors

//* Socket IO starts here:
// npm i socket.io
// npm i --save-optional bufferutil utf-8-validate

import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/config/config.env" });

import express, { Express } from "express";
import * as http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import { DataSource } from "typeorm";
import { User } from "./models/User";

import { errorHandler } from "./middleware/errorHandler";

// Socket server files:
import {registerSocketServer} from "./socketServer";

import "reflect-metadata";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.DATABASE,
  entities: [User],
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
app.use(
  cors({
    origin: ["http://localhost:8000"],
    credentials: true,
  })
);

// Mount Routers:
app.use("/api/v1/auth", authRouter);

// Use Error Handler:
app.use(errorHandler);

const server = http.createServer(app);
registerSocketServer(server); // Initialize a socket server

// Refactored from app.listen to server.listen
server.listen(PORT || 3000, () => {
  console.log(`Listening on port: ${PORT}`);
});
