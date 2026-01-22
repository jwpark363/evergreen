import { toYMD } from "../libs/DateUtil";

//시스템 관리자 권한
export const SYSTEM_ADMIN_ID = "72a9bad0-b1e7-4425-a033-49558492ad10";
export const ADMIN_ROLE = ['GM','AS'];
export enum ROLE{
    P="회장",
    ADV="고문",
    SVP="수석부회장",
    VP="부회장",
    A="감사",
    SRC="전략강화위원",
    DIR="감독",
    COA="코치",
    GM="총무",
    AS="간사",
    MEM="회원",
}
export enum MEMBER_STATUS{
    active="활동",
    inactive="휴식",
    withdraw="탈퇴",
    except="제외"
}
type POSITION = 'GK'|'DF'|'MF'|'FW';
type FOOT = 'left'|'right'|'both';
type LEVEL = 'best'|'good'|'average';
export interface Member {
    id: string;
    name: string;
    role: keyof typeof ROLE;
    phone: string;
    join_date: string;
    status: keyof typeof MEMBER_STATUS;
    back_number: number;
    position1: POSITION;
    position2: POSITION;
    main_foot: FOOT;
    level: LEVEL;
    note: string;
    updated_at: Date;
}

export function newMember() : Partial<Member>{
    return {
        name :"",
        role :"MEM",
        phone :"",
        join_date : toYMD(new Date()),
        status : "active",
        back_number : 0,
        position1 : "MF",
        position2 : "MF",
        main_foot : "right",
        level : "average",
        note : "",
    }
}