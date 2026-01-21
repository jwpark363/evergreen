import { supabase } from '../supabase_client'
// 외부에서 사용하지 않는 가상 도메인
const DOMAIN = 'fcevergreen.com';

export interface LoginData{
  phone:string,
  password:string
}

export const userLogout = async () => {
  await supabase.auth.signOut();
  return null;
}

export const loginWithUsername = async ({phone, password}:LoginData) => {
  // 사용자가 입력한 ID를 이메일 형식으로 변환
  const virtualEmail = `${phone}@${DOMAIN}`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: virtualEmail,
    password: password,
  });
  console.log(data);
  if(data.user){
    const login_user = await getMember(phone);
    return { data, error, login_user };
  }
  return { data, error, login_user:null };
};

export const currentUser = async () => {
  const {data} = await supabase.auth.getUser();
  console.log(data);
  if(data && data.user && data.user.email){
    const login_user = await getMember(data.user.email.split('@')[0]);
    return login_user;
  }
  return null;
}

export async function getMember(phone:string) {
    if(!phone) return null;
    const { data } = await supabase
    .from('member')
    .select('*')
    .eq("phone",phone)
    console.log(data);
    if (data && data.length > 0)
      return data[0]
    return null;
}