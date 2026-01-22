import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEvent } from '../api/event_api';
import EventCard from '../components/event_card';
import type { Event } from '../types/event_types';
import EventModal from '../components/event_modal';
import { useLoginStore } from '../state/login_state';
import { checkAuth } from '../api/member_api';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 { font-size: 28px; font-weight: 700; color: #1e293b; }
  p { font-size: 14px; color: #64748b; margin-top: 4px; }
`;

const AddButton = styled.button`
  display: flex; align-items: center; gap: 8px;
  background: #0f172a; color: white; padding: 10px 20px;
  border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;
export default function EventView(){
    const {user} = useLoginStore();  
    const [is_loading, setLoading] = useState(true);
    const [is_formopen, setFormOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [form_data, setFormData] = useState<Event | undefined>(undefined);
    const openEditForm = (data:Event) => {
        setFormOpen(true);
        setFormData(data);
    }
    const handleLoading = () => {
      setLoading(true);
    }
    const handleClose = () => {
      setLoading(true);
      setFormOpen(false);
    }
    useEffect(()=>{
      (async () => {
        await getEvent().then(setEvents)
      })();
      setLoading(false);
      setFormData(undefined);
    },[is_loading])

  return (
    <>
    <Container>
      <Header>
        <div>
          <h1>일정 관리</h1>
          <p>동호회의 주요 행사를 관리하세요</p>
        </div>
      { checkAuth(user, undefined) &&
        <AddButton onClick={() => setFormOpen(true)}>
          <Plus size={18} /> 일정 추가
        </AddButton>
      }
      </Header>

    <p>예정 / 진행 일정</p>
    <MainLayout>
        {events.filter(data => data.status === 'planned' || data.status === 'ongoing')
            .map((data,i) => <EventCard key={i} data={data}
                              handleLoading={handleLoading}
                              handleClick={() => openEditForm(data)} />)}
    </MainLayout>
    <p>종료 / 취소 일정</p>
    <MainLayout>
        {events.filter(data => data.status === 'completed' || data.status === 'cancelled')
            .map((data,i) => <EventCard key={i} data={data} />)}
    </MainLayout>
    </Container>
    {is_formopen && <EventModal data_id={form_data?.id} is_open={is_formopen} onClose={handleClose} data={form_data} />}
    </>
  );
};
