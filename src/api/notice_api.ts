import { supabase } from '../supabase_client'
import type { Notice } from '../types/notice_types'

const TABLE = 'notice'

export async function getNotice() {
    const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    if (error) throw error
    return data
}
type NewNotice = Omit<Notice, "id" | "created_at" | "updated_at">
export async function addNotice(new_data: NewNotice) {
    const { data, error } = await supabase
        .from(TABLE)
        .insert([new_data])//반드시 배열 형태로
    if (error) throw error
    return data
}
export async function updateNotice(id:string, new_data: NewNotice) {
    const _new_data = {...new_data, updated_at:new Date()};
    const { data, error } = await supabase
    .from(TABLE)
    .update(_new_data)
    .eq('id', id)
    if (error) throw error
    return data
}
// export async function approveApplication(id:string) {
//     const _new_data = {status:'approve', updated_at:new Date()};
//     const { data, error } = await supabase
//     .from(TABLE)
//     .update(_new_data)
//     .eq('id', id)
//     if (error) throw error
//     return data
// }
// export async function rejectApplication(id:string) {
//     const _new_data = {status:'reject', updated_at:new Date()};
//     const { data, error } = await supabase
//     .from(TABLE)
//     .update(_new_data)
//     .eq('id', id)
//     if (error) throw error
//     return data
// }
