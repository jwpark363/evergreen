import { supabase } from '../supabase_client'
import type { Event } from '../types/event_types'

const TABLE = 'event'

export async function getEvent() {
    const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('id', { ascending: false })
    if (error) throw error

    for(let event of data){
        if(event.attendance && event.attendance.length > 0){
            event.attendance_name = await getMembersByPhones(event.attendance);
        }
        if(event.absence && event.absence.length > 0){
            event.absence_name = await getMembersByPhones(event.absence);
        }
    }
    return data
}
type NewEvent = Omit<Event, "id">
export async function addEvent(new_data: NewEvent) {
    const { data, error } = await supabase
        .from(TABLE)
        .insert([new_data])//반드시 배열 형태로
    if (error) throw error
    return data
}
export async function updateEvent(id:string, new_data: NewEvent) {
    const _new_data = {...new_data, updated_at:new Date()};
    const { data, error } = await supabase
    .from(TABLE)
    .update(_new_data)
    .eq('id', id);
    if (error) throw error
    return data
}

async function getMembersByPhones(phones:string[]) {
    if(!phones || phones.length <= 0) return null;
    const { data, error } = await supabase
        .from('member')
        .select('name')
        .in('phone', phones)
        .order('name');
    if (error) return null;
    return data.map(d => d.name);
}

export async function voteEvent(id:string, is_approve:boolean, event:Event, phone:string){
    if(!id || !event) return event;
    let _attendance = [];
    let _absence = []
    if(is_approve){
        //참가 처리
        _attendance = Array.from(new Set([...(event.attendance || []), phone]));
        _absence = event.absence.filter(d => d !== phone) || [];
    }else{
        //불참 처리
        _attendance = event.attendance.filter(d => d !== phone) || [];
        _absence = Array.from(new Set([...(event.absence || []), phone]));
    }
    const { error } = await supabase
        .from(TABLE)
        .update({ attendance : _attendance, absence : _absence })
        .eq('id', id);
    if (error) throw error
    return {
        ...event,
        attendance:_attendance,
        absence:_absence
    }
}
