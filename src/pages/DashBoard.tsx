import styled from "styled-components";
import { Users, Calendar, ChevronRight, Pin } from 'lucide-react';
import type { Member } from "../types/member_types";
import { useEffect, useState } from "react";
import type { Event } from "../types/event_types";
import type { Notice } from "../types/notice_types";
import { getMembers } from "../api/member_api";
import { getEvent } from "../api/event_api";
import { getNotice } from "../api/notice_api";
import { stringToYMD } from "../libs/DateUtil";
import type { ROUTER } from "../types/router_types";
const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
`;
const TitleSection = styled.div`
  h2 { font-size: 24px; font-weight: 700; color: #1a202c; }
  p { font-size: 14px; color: #718096; margin-top: 4px; }
`;
const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;
const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;
const IconWrapper = styled.div<{ $bg: string; $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: ${props => props.$bg};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StatInfo = styled.div`
  label { font-size: 14px; color: #718096; display: block; margin-bottom: 4px; }
  p { font-size: 28px; font-weight: 800; color: #1a202c; }
  span { font-size: 16px; font-weight: 500; margin-left: 4px; color: #718096; }
`;
const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const ContentBox = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 20px;
`;
const BoxHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h3 { font-size: 18px; font-weight: 700; }
`;
const MoreBtn = styled.button`
  background: none; border: none; color: #a0aec0; font-size: 13px;
  display: flex; align-items: center; cursor: pointer;
  &:hover { color: #3b82f6; }
`;
const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
`;
const NoticeItem = styled.div<{ $is_pinned?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
  gap: 12px;
  background-color: ${props => props.$is_pinned ? '#fcfdff' : 'transparent'};
  .row{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title { flex: 1; font-size: 14px; color: #2d3748;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .date { font-size: 12px; color: #a0aec0; }
`;
const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const ScheduleItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
`;
const DateLabel = styled.div`
  background: white;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #3b82f6;
  text-align: center;
  min-width: 60px;
  border: 1px solid #e2e8f0;
`;
const ScheduleTitle = styled.div`
  display: flex;
  flex-direction: column;
  strong { font-size: 15px; color: #2d3748; }
  span { font-size: 13px; color: #718096; margin-top: 2px; }
`;
interface DashboardProps{
  setView: (view:ROUTER) => void
}
export default function DashboardView({setView}:DashboardProps){
  const [member, setMembers] = useState<Member[]>([]);
  const [event, setEvents] = useState<Event[]>([]);
  const [notice, setNotices] = useState<Notice[]>([]);
  useEffect(() => {
    getMembers().then(setMembers);
    getEvent().then(setEvents);
    getNotice().then(setNotices);
  },[])
  return (
    <DashboardWrapper>
      <TitleSection>
        <h2>대시보드</h2>
        <p>오늘의 주요 현황입니다.</p>
      </TitleSection>
      {/* 상단 요약 카드 (회원수, 일정수) */}
      <SummaryGrid>
        <StatCard>
          <IconWrapper $bg="#eff6ff" $color="#3b82f6"><Users size={24} /></IconWrapper>
          <StatInfo>
            <label>현재 활동 회원수</label>
            <p>{member.filter(data => data.status === 'active').length}<span>명</span></p>
          </StatInfo>
        </StatCard>
        <StatCard>
          <IconWrapper $bg="#fff7ed" $color="#f97316"><Calendar size={24} /></IconWrapper>
          <StatInfo>
            <label>이번 주 예정 일정</label>
            <p>{event.filter(data => data.status === 'ongoing').length}<span>건</span></p>
          </StatInfo>
        </StatCard>
      </SummaryGrid>
      {/* 메인 콘텐츠 그리드 */}
      <ContentGrid>
        {/* 공지사항 섹션 */}
        <ContentBox>
          <BoxHeader>
            <h3>공지사항</h3>
            <MoreBtn onClick={() => setView("notice")}>더보기 <ChevronRight size={14} /></MoreBtn>
          </BoxHeader>
          <NoticeList>
            {/* 고정 공지사항 */}
            <NoticeItem $is_pinned>
              <IconWrapper $bg="#eff6ff" $color="#3b82f6"><Pin size={16} /></IconWrapper>
              {notice.filter(data => data.is_pinned).map((data,i) =>
                <div key={i} className="row">
                  <span className="title">{data.title}</span>
                  <span className="date">{stringToYMD(data.created_at)}</span>
                </div>
              )}
            </NoticeItem>
            {/* 일반 공지사항 */}
            <NoticeItem>
              {notice.filter(data => !data.is_pinned).map((data,i) =>
                <div key={i} className="row">
                  <span className="title">{data.title}</span>
                  <span className="date">{stringToYMD(data.created_at)}</span>
                </div>
              )}
            </NoticeItem>
          </NoticeList>
        </ContentBox>
        {/* 일정 리스트 섹션 */}
        <ContentBox>
          <BoxHeader>
            <h3>일정 리스트</h3>
            <MoreBtn onClick={() => setView("event")}>전체보기 <ChevronRight size={14} /></MoreBtn>
          </BoxHeader>
          <ScheduleList>
            {event.map((data,i) => 
            <ScheduleItem key={i}>
              <DateLabel>{data.date}</DateLabel>
              <ScheduleTitle>
                <strong>{data.title}</strong>
                <span>{data.from_time} · {data.location}</span>
              </ScheduleTitle>
            </ScheduleItem>
            )}
          </ScheduleList>
        </ContentBox>
      </ContentGrid>
    </DashboardWrapper>
    )
}