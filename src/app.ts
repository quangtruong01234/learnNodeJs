
import dotenv from 'dotenv';
dotenv.config()
import express, { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from './types/process';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
const app = express();

//init middlewares
app.use(morgan("dev")); // morgan("combined")
app.use(helmet());
app.use(compression()); //size data
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
//init db
import './dbs/init.mongodb';
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()
//init routes
import router from './routes/index';
app.use('/', router)
//handling error

app.use((req:Request, res:Response, next:NextFunction) => {
    const error: any = new Error('Not Found');
    error.status = 404
    next(error);
})

app.use((error:ErrorWithStatus, req:Request, res:Response, next:NextFunction) => {
    const statusCode = error?.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error?.message || 'Internal Server Error',
    })
})

export default app;
