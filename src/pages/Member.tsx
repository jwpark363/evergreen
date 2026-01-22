import styled from 'styled-components';
import { Search, UserPlus, Settings, KeySquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import MemberModal, { PasswordModal } from '../components/member_modal';
import { ROLE, MEMBER_STATUS as STATUS, type Member } from '../types/member_types';
import { checkAuth, getMembers } from '../api/member_api';
import { stringToYMD } from '../libs/DateUtil';
import { TableWrapper, Table, StatusBadge, IconButton } from '../components/table_styled';
import { useLoginStore } from '../state/login_state';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  h1 { font-size: 28px; font-weight: 700; color: #1a202c; }
  p { font-size: 14px; color: #718096; margin-top: 5px; }
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #0f172a;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f1f5f9;
  padding: 12px 16px;
  border-radius: 10px;
  input {
    background: none; border: none; outline: none; width: 100%;
    font-size: 14px; color: #4a5568;
    &::placeholder { color: #a0aec0; }
  }
`;
export default function MemberView(){
    const {user} = useLoginStore();  
    const [is_loading, setLoading] = useState(true);
    const [is_formopen, setFormOpen] = useState(false);
    const [is_pwdopen, setPwdOpen] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [keyword, setKeyword] = useState<string>("");
    const [form_data, setFormData] = useState<Member | undefined>(undefined);
    const openEditForm = (member:Member) => {
        setFormOpen(true);
        setFormData(member);
    }
    const handleClose = () => {
      setFormOpen(false);
      setLoading(true);
    }

    const openPwdForm = () => {
      console.log("password form")
      setPwdOpen(true);
    }
    const handlePwdClose = () => {
      setPwdOpen(false);
    }

    const handleKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    }

    useEffect(()=>{
      getMembers().then(setMembers);
      setLoading(false);
    },[is_loading])
  
    const _members = keyword.length > 0 ? members.filter(d => d.name.includes(keyword) || d.phone.includes(keyword)) : members;
    return (
    <>
    <Container>
      {/* 헤더 섹션 */}
      <Header>
        <div>
          <h1>회원 관리</h1>
          <p>총 {members.length}명의 회원이 등록되어 있습니다</p>
        </div>
        {checkAuth(user,undefined) && 
          <AddButton onClick={() => {setFormOpen(true); setFormData(undefined);}}>
            <UserPlus size={18} /> 회원 추가
          </AddButton>
}
      </Header>
      {/* 검색 바 */}
      <SearchWrapper>
        <Search size={18} color="#a0aec0" />
        <input type="text" placeholder="이름, 전화번호로 검색..." value={keyword} onChange={handleKeyword}/>
      </SearchWrapper>
      {/* 회원 테이블 */}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>회원</th><th>전화번호</th><th>가입일</th><th>상태</th>
              {/* <th style={{ textAlign: 'center' }}>관리</th> */}
            </tr>
          </thead>
          <tbody>
            {_members.map((data,i) => 
                <MemberRow key={i}
                    current_user={user} 
                    member={data}
                    openEditForm={openEditForm}
                    openPwdForm={openPwdForm}
                />
            ) }
            {/* ... 더 많은 데이터 */}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
    { is_formopen &&
        <MemberModal
            member_id={form_data ? form_data.id : undefined}
            is_open={is_formopen}
            init_data={form_data}
            onClose={handleClose}
        />
    }
    { is_pwdopen &&
        <PasswordModal
            member_id={form_data ? form_data.id : undefined}
            is_open={is_pwdopen}
            onClose={handlePwdClose}
        />
    }
    </>
    );
};

// 테이블 행 컴포넌트
interface MemberRowProps{
    current_user: Member | null
    member: Member
    openEditForm: (member:Member) => void
    openPwdForm: () => void
}
const MemberRow = ({ current_user, member, openEditForm, openPwdForm }: MemberRowProps) => (
  <tr>
    <td>{member.name} {ROLE[member.role]}</td>
    <td>{member.phone}</td>
    <td>{stringToYMD(member.join_date)}</td>
    <td>
      <StatusBadge $active={member.status === 'active'}>{STATUS[member.status]}</StatusBadge>
      <IconButton onClick={() => {openEditForm(member);}}><Settings size={16} /></IconButton>
      {current_user && member.id === current_user.id &&
        <IconButton onClick={() => {openPwdForm();}}><KeySquare size={16} /></IconButton> }
    </td>
  </tr>
);