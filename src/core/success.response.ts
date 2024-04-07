'use strict'

import { Response } from "express";

const StatusCode = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created!'
}
interface SuccessResponseParams {
    options?:any
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, unknown>;
}
class SuccessResponse {
    message: string;
    status: number;
    metadata: Record<string, unknown>;
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }:SuccessResponseParams) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res: Response<any, Record<string, any>>, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }:SuccessResponseParams) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {
    options: any;
    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }:SuccessResponseParams) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options
    }
}

export {
    OK,
    CREATED,
    SuccessResponse
}