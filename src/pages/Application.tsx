import styled from 'styled-components';
import { Search, Settings  } from 'lucide-react';
import { useEffect, useState } from 'react';
import { stringToYMD } from '../libs/DateUtil';
import type { Application } from '../types/application_types';
import { getApplication } from '../api/application_api';
import { ApplicationManagementModal } from '../components/application_modal';
import { TableWrapper, Table, StatusBadge, IconButton } from '../components/table_styled';
import type { Member } from '../types/member_types';
import { useLoginStore } from '../state/login_state';
import { checkAuth } from '../api/member_api';

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
// const TableWrapper = styled.div`
//   background: white;
//   border-radius: 12px;
//   border: 1px solid #e2e8f0;
//   overflow: hidden;
// `;
// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   text-align: left;
//   th {
//     background: #f8fafc;
//     padding: 16px;
//     font-size: 13px;
//     font-weight: 600;
//     color: #64748b;
//     border-bottom: 1px solid #e2e8f0;
//   }
//   td {
//     padding: 16px;
//     font-size: 14px;
//     color: #1e293b;
//     border-bottom: 1px solid #f1f5f9;
//   }
// `;
// const StatusBadge = styled.span<{ $active: boolean }>`
//   padding: 4px 12px;
//   border-radius: 20px;
//   font-size: 12px;
//   font-weight: 600;
//   background: ${props => props.$active ? '#1e293b' : '#f1f5f9'};
//   color: ${props => props.$active ? 'white' : '#94a3b8'};
// `;

// const IconButton = styled.button<{ $color?: string }>`
//   background: none;
//   border: none;
//   cursor: pointer;
//   color: ${props => props.$color || '#94a3b8'};
//   display: flex;
//   align-items: center;
//   transition: color 0.2s;
//   &:hover { color: ${props => props.$color ? '#c53030' : '#4a5568'}; }
// `;

export default function ApplicationView(){
    const {user} = useLoginStore();
    const [is_loading, setLoading] = useState(true);
    const [is_formopen, setFormOpen] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [keyword, setKeyword] = useState<string>("");
    const [form_data, setFormData] = useState<Application | undefined>(undefined);
    const openEditForm = (data:Application) => {
        setFormOpen(true);
        setFormData(data);
    }
    const handleClose = () => {
      setLoading(true);
      setFormOpen(false);
    }
    const handleKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    }
    useEffect(()=>{
      getApplication().then(setApplications);
      setLoading(false);
    },[is_loading])
    const _applications = keyword.length > 0 ? applications.filter(d => d.name.includes(keyword) || d.phone.includes(keyword)) : applications;
    return (
    <>
    <Container>
      {/* 헤더 섹션 */}
      <Header>
        <div>
          <h1>가입 신청 관리</h1>
          <p>{applications.filter(data => data.status === 'wait').length}건의 대기 중인 신청이 있습니다.</p>
        </div>
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
              <th>이름</th><th>전화번호</th><th>가입일</th><th>상태</th>
              {/* <th style={{ textAlign: 'center' }}>관리</th> */}
            </tr>
          </thead>
          <tbody>
            {_applications.map((data,i) => 
                <DataRow key={i} 
                    data={data}
                    current_user={user}
                    openEditForm={openEditForm}
                />
            ) }
            {/* ... 더 많은 데이터 */}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
    {is_formopen && <ApplicationManagementModal is_open={is_formopen} onClose={handleClose} data={form_data}/>}
    </>
    );
};

// 테이블 행 컴포넌트
interface DataRowProps{
    data: Application
    current_user: Member | null
    openEditForm: (data:Application) => void
}
const DataRow = ({ data, current_user, openEditForm }: DataRowProps) => (
  <tr>
    <td>{data.name}</td>
    <td>{data.phone}</td>
    {/* <td>{data.message}</td> */}
    <td>{stringToYMD(data.applied_date)}</td>
    <td>
      <StatusBadge $active={data.status === 'wait'}>{data.status}</StatusBadge>
      {checkAuth(current_user,undefined) &&
      <IconButton onClick={() => {openEditForm(data);}}><Settings size={16} /></IconButton>
      }
    </td>
  </tr>
);