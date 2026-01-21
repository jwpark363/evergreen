import { toYMD } from "../libs/DateUtil";

export interface Application {
    id: string;
    name: string;
    phone: string;
    message: string;
    applied_date: string;
    status: 'wait'|'approve'|'reject';
    note: string;
    updated_at: Date;
}

export function newApplication() : Partial<Application>{
    return {
        name :"",
        phone :"",
        message:"",
        applied_date : toYMD(new Date()),
        status : "wait",
        note : "",
    }
}