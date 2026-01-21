import { toYMD } from "../libs/DateUtil";

export enum EVENT_STATUS{
    planned = "예정",
    ongoing = "진행",
    completed = "완료",
    cancelled = "취소"
}
// type STATUS = 'planned' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    from_time: string;
    to_time: string;
    location: string;
    status: keyof typeof EVENT_STATUS;
    attendance: string[];
    absence: string[];
    attendance_name: string[];
    absence_name: string[];
}

export function newEvent() : Partial<Event>{
    return {
        title: "",
        description: "",
        date: toYMD(new Date()),
        from_time: "09:00",
        to_time: "11:30",
        location: "신송중",
        status: 'planned',
        attendance: [],
        absence: [],
    }
}