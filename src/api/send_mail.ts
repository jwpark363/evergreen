import { supabase } from "../supabase_client";

const RECEIVE_MAIL_LIST = ["jw.park363@gmail.com"];

export const sendEmail = async (content: string) => {
  const { data, error } = await supabase.functions.invoke('send-email', {
    // headers: { 'Content-Type': 'application/json' }, // invoke 사용 시 자동 설정됨
    body:  JSON.stringify({ 
      to: RECEIVE_MAIL_LIST, 
      subject: "FC-EverGreen Notification Mail!", 
      content: content
    })//to, subject, content
  });
  if (error) console.error("발송 실패:", error);
  else console.log("발송 성공:", data);
};