import emailjs from '@emailjs/browser';
import { toHM, toYMD } from '../libs/DateUtil';

export interface EmailData {
    title: string;
    email: string;      // 수신자 이메일
    name: string;       // 발신자명
    message: string;    // 발신 내용
}

export const sendClubEmail = async ({title,email,name,message}: EmailData) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    try {
    const response = await emailjs.send(
        serviceId,
        templateId,
        {
            email: email, // 수신자 메일 주소
            title: title,
            name: name,
            time: `${toYMD(new Date())} ${toHM(new Date())}`,
            message: message,
        },
        publicKey
    );
    console.log('이메일 전송 성공:', response.status, response.text);
    return true;
    } catch (error) {
    console.error('이메일 전송 실패:', error);
    return false;
    }
    };