// NoticeBoard.tsx
import styled from "styled-components";
import type { Notice } from "../types/notice_types";
import { getNotice } from "../api/notice_api";
import { useEffect, useState } from "react";
import { stringToYMD } from "../libs/DateUtil";
import NoticeModal from "../components/notice_modal";
import { Edit2, Plus } from "lucide-react";
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
const Section = styled.div`
  margin-top: 2rem;
`;
const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;
const NoticeCard = styled.div<{ $pinned?: boolean }>`
  border: 1px solid ${({ $pinned }) => ($pinned ? "#BEDBFF" : "#ccc")};
  padding-left: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  background-color: ${({ $pinned }) => ($pinned ? "#EFF6FF" : "#fffbfb")};
`;
const NoticeTitle = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1.1rem;
  font-weight: bold;
`;
const Meta = styled.p`
  font-size: 0.85rem;
  color: #999;
  margin: 0.3rem 0;
`;
const Content = styled.p`
  font-size: 0.95rem;
  color: #444;
`;
const EditButton = styled.button`
  background: none; border: none; color: #999; cursor: pointer;
  &:hover { color: #333; }
`;
export default function NoticeBoard(){
    const [is_loading, setLoading] = useState(true);
    const [is_formopen, setFormOpen] = useState(false);
    const [notices, setNotice] = useState<Notice[]>([]);
    const [form_data, setFormData] = useState<Notice | undefined>(undefined);
    const openEditForm = (data:Notice) => {
        setFormOpen(true);
        setFormData(data);
    }
    const handleClose = () => {
      setLoading(true);
      setFormOpen(false);
    }
    useEffect(()=>{
      getNotice().then(setNotice);
      setLoading(false);
    },[is_loading])
  return (
    <>
    <Container>
      <Header>
        <div>
          <h1>공지사항</h1>
          <p>중요한 소식과 안내를 확인하세요</p>
        </div>
        <AddButton onClick={() => setFormOpen(true)}>
          <Plus size={18} /> 일정 추가
        </AddButton>
      </Header>
        <Section>
            <SectionTitle>📌 고정된 공지</SectionTitle>
            {notices.filter(data => data.is_pinned === true).map((notice, i) => (
                <NoticeItem key={i} notice={notice} handleClick={()=>openEditForm(notice)} />
            ))}
        </Section>

        <Section>
        <SectionTitle>일반 공지</SectionTitle>
        {notices.filter(data => data.is_pinned !== true).map((notice, i) => (
            <NoticeItem key={i} notice={notice} handleClick={()=>openEditForm(notice)} />
        ))}
        </Section>
    </Container>
    {is_formopen && 
        <NoticeModal is_open={is_formopen} onClose={handleClose}
            data={form_data} data_id={form_data?.id}/>}
    </>
  );
};

interface NoticeItemProps{
    notice: Notice
    handleClick: () => void
}
function NoticeItem({notice, handleClick}:NoticeItemProps){
    return(
        <NoticeCard $pinned={notice.is_pinned}>
            <NoticeTitle>{notice.title}
            <EditButton onClick={handleClick}><Edit2 size={16} /></EditButton>
            </NoticeTitle>
            <Meta>
            {notice.author} · {stringToYMD(notice.created_at)} · 조회 {notice.views}
            </Meta>
            <Content>{notice.content}</Content>
        </NoticeCard>
    )
}