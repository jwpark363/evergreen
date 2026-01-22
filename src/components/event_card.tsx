import styled from 'styled-components';
import { Edit2, Calendar, MapPin, Users, Stamp } from 'lucide-react';
import { EVENT_STATUS, type Event } from '../types/event_types';
import { useLoginStore } from '../state/login_state';
import { useState } from 'react';
import { VoteModal } from './event_modal';
import { checkAuth } from '../api/member_api';

const CardContainer = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .title-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    h3 { font-size: 18px; color: #333; font-weight: 600; }
  }
  .badge-group{
    display: flex;
    gap: 4px;
  }
`;
const StatusBadge = styled.span<{ $status: string }>`
  width: fit-content;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${props => 
    props.$status === 'ongoing' ? '#334155' : 
    props.$status === 'planned' ? '#000' : '#e2e8f0'};
  color: ${props => props.$status === 'completed' ? '#64748b' : '#fff'};
`;
const StampBadge = styled(StatusBadge)`
  background: ${props => 
    props.$status === 'vote' ? '#c57432' : '#334155'};
  color: ${props => props.$status === 'vote' ? '#fff' : '#64748b'};
`;
const EditButton = styled.button`
  background: none; border: none; color: #999; cursor: pointer;
  &:hover { color: #333; }
`;
const CardBody = styled.div`
  .description {
    font-size: 14px; color: #666; margin-bottom: 12px;
    line-height: 1.5;
  }
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 13px;
  margin-bottom: 6px;
`;
const AttendanceSection = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
 
  .user-icon { color: #999; margin-top: 8px;}
  .vote-icon { color: #ec4e1d; margin-top: 4px; cursor: pointer;}
  .list-wrapper { display: flex; flex-direction: column; gap: 8px;}
`;
const AttendanceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .names { font-size: 13px; color: #718096; }
`;
const Badge = styled.span<{ type: 'join' | 'absent' }>`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 65px;
  text-align: center;
  background: ${props => props.type === 'join' ? '#eff6ff' : '#f1f5f9'};
  color: ${props => props.type === 'join' ? '#3b82f6' : '#64748b'};
`;
interface EventProps {
    data: Event,
    handleClick?: () => void
    handleLoading?: () => void
}
export default function EventCard({ data, handleClick, handleLoading }: EventProps){
  const {user} = useLoginStore();
  const [is_formopen, setFormOpen] = useState(false);
  const handleVote = () => {
    setFormOpen(true);
  }
  const isVoted = () => {
    if(!user) return false;
    if(data.status === "cancelled" || data.status === "completed") return true;
    if(data.attendance && data.attendance.length > 0){
      if(data.attendance.findIndex(m => m === user.phone) >= 0) return true
    }
    if(data.absence && data.absence.length > 0){
      if(data.absence.findIndex(m => m === user.phone) >= 0) return true
    }
    return false;
  }
  const handleClose = () => {
    setFormOpen(false);
    if(handleLoading){
      handleLoading();
    }
  }
  return (
    <>
    <CardContainer>
      <CardHeader>
        <div className="title-group">
          <h3>{data.title}</h3>
          <div className="badge-group">
            <StatusBadge $status={data.status}>{EVENT_STATUS[data.status]}</StatusBadge>
            { !isVoted() && <StampBadge $status="vote">참석? 불참?</StampBadge> }
          </div>
        </div>
        { checkAuth(user, undefined) &&
        <EditButton onClick={handleClick}><Edit2 size={16} /></EditButton>
        }
      </CardHeader>
      <CardBody>
        <p className="description">{data.description}</p>
        <InfoRow>
          <Calendar size={16} /> <span>{data.date}</span> <span>{data.from_time}</span>
        </InfoRow>
        <InfoRow>
          <MapPin size={16} /> <span>{data.location}</span>
        </InfoRow>
        <AttendanceSection>
          <div className="list-wrapper">
          <Users size={18} className="user-icon" />
          { (data.status === "ongoing" || data.status === "planned") && <Stamp size={18} className="vote-icon" onClick={handleVote} /> }
          </div>
          <div className="list-wrapper">
            <AttendanceRow>
              <Badge type="join">{data.attendance.length ?? 0}명 참가</Badge>
              <span className="names">{data.attendance_name?.join(",") ?? ""}</span>
            </AttendanceRow>
            <AttendanceRow>
              <Badge type="absent">{data.absence.length ?? 0}명 불참</Badge>
              <span className="names">{data.absence_name?.join(",") ?? ""}</span>
            </AttendanceRow>
          </div>
        </AttendanceSection>
      </CardBody>
    </CardContainer>
    {is_formopen && <VoteModal is_open={is_formopen} onClose={handleClose} data={data} />}
    </>
  );
};