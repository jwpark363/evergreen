import { supabase } from '../supabase_client'
import type { Application } from '../types/application_types'

const TABLE = 'application'

export async function getApplication() {
    const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('applied_date');
    if (error) throw error
    return data
}
type NewApplication = Omit<Application, "id" | "updated_at">
export async function addApplication(new_data: NewApplication) {
    const { data, error } = await supabase
        .from(TABLE)
        .insert([new_data])//반드시 배열 형태로
    if (error) throw error
    return data
}
export async function checkApplicationByPhone(phone:string){
    const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('phone',phone)
    if (error) throw error
    return data
}
export async function updateApplication(id:string, new_data: NewApplication) {
    const _new_data = {...new_data, updated_at:new Date()};
    const { data, error } = await supabase
    .from(TABLE)
    .update(_new_data)
    .eq('id', id)
    if (error) throw error
    return data
}
export async function approveApplication(id:string) {
    const _new_data = {status:'approve', updated_at:new Date()};
    const { data, error } = await supabase
    .from(TABLE)
    .update(_new_data)
    .eq('id', id)
    if (error) throw error
    return data
}
export async function rejectApplication(id:string) {
    const _new_data = {status:'reject', updated_at:new Date()};
    const { data, error } = await supabase
    .from(TABLE)
    .update(_new_data)
    .eq('id', id)
    if (error) throw error
    return data
}
