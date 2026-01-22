import { supabase } from '../supabase_client'
import { ADMIN_ROLE, SYSTEM_ADMIN_ID, type Member } from '../types/member_types'

export async function getMembers() {
    const { data, error } = await supabase
        .from('member')
        .select('*')
        .order("name")
    if (error) throw error
    return data
}
type NewMember = Omit<Member, "id" | "updated_at">
export async function addMember(new_data: NewMember) {
    const { data, error } = await supabase
        .from('member')
        .insert([new_data])//반드시 배열 형태로
    if (error) throw error
    return data
}
export async function updateMember(id:string, new_data: NewMember) {
    const _new_data = {...new_data, updated_at:new Date()};
    const { data, error } = await supabase
        .from('member')
        .update(_new_data)
        .eq('id', id);
    if (error) throw error
    return data
}
export async function getMembersByPhones(phones:string[]) {
    if(!phones || phones.length <= 0) return null;
    const { data, error } = await supabase
        .from('member')
        .select('*')
        .in('phone', phones);
    if (error) return null;
    return data
}
export function checkAuth(current_user:Member | undefined | null,
                            target_id:string | undefined){
    //본인것 이외는 총무와 간사, 그리고 지정된 사용자 만 수정 처리 가능함
    if(!current_user) return false;
    if(current_user.id === SYSTEM_ADMIN_ID) return true;
    if(current_user.role in ADMIN_ROLE) return true;
    if(!target_id) return false;
    if(target_id === current_user.id) return true;
    return false;
}
export async function changePassword(new_password:string){
    const { data, error } = await supabase.auth.updateUser({
          password: new_password
    })
    console.log(data)
    console.log(error)
    if (error) return false
    return true
}