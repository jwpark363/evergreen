import { useState } from "react";
import styled from "styled-components";
import { Menu, X, Home, Users, UserPlus, Calendar, Bell, LogOut } from 'lucide-react';
import type { ROUTER } from '../types/router_types';
import { useLoginStore } from "../state/login_state";
import { ROLE } from "../types/member_types";
import { userLogout } from "../api/login_api";

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 110;
  background: white;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 5px;
  @media (max-width: 1024px) { display: block; }
`;
const HomeButton = styled.button<{ $color?: string }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$color || '#94a3b8'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
  &:hover { color: ${props => props.$color ? '#c53030' : '#4a5568'}; }
  span{
    color: #474749;
    font-size: large;
    font-weight: bold;
  }
`
const Sidebar = styled.aside<{ $is_open: boolean }>`
  width: 240px;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: transform 0.3s ease;
  @media (max-width: 1024px) {
    position: fixed;
    z-index: 100;
    height: 100%;
    transform: ${props => props.$is_open ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;
const NavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? '#3b82f6' : '#555'};
  background: ${props => props.$active ? '#eff6ff' : 'transparent'};
  transition: all 0.2s ease-in-out;
  &:hover {
    background: ${props => props.$active ? '#eff6ff' : '#f9fafb'};
  }
  svg {
    color: ${props => props.$active ? '#3b82f6' : '#999'};
  }
`;
const UserInfo = styled.div`
  padding: 10px 10px 20px 10px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* '홈으로'*/
  div.home-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
    font-weight: 600;
    cursor: pointer;
  }
  /* 사용자 이름 */
  p {
    font-size: 13px;
    color: #888;
    line-height: 1.4;
    margin: 10px 0;
  }
`;
const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  width: fit-content;
  &:hover {
    color: #666;
  }
`;
const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;
interface SideBarProps{
    current_view: ROUTER,
    setView: (menu:ROUTER) => void
}
export function SideBar({current_view, setView}:SideBarProps){
    const {user, setUser} = useLoginStore();
    const [is_open, setIsOpen] = useState(false);
    const handleLogout = () => {
      (async () => {
        await userLogout();
        setUser(null);
        setView('dashboard');
      })()
    }
    return(
    <>
        <MobileMenuButton onClick={() => setIsOpen(!is_open)}>
            {is_open ? <X /> : <Menu />}
        </MobileMenuButton>
        <Sidebar $is_open={is_open}>
        <UserInfo>
          <HomeButton onClick={()=>setView('intro')}>
            <Home size={18}/>
            <span>홈으로</span>
          </HomeButton>
            <p>{user && `${user.name} ${ROLE[user.role]}님`} 반갑습니다.</p>
            {user && <LogoutBtn onClick={handleLogout}><LogOut size={16} /> Logout</LogoutBtn>}
        </UserInfo>

        <NavList>
            <NavItem $active={current_view === 'dashboard'} onClick={() => {setView('dashboard'); setIsOpen(false);}}>
            <Home size={20} /> 대시보드
            </NavItem>
            <NavItem $active={current_view === 'member'} onClick={() => {setView('member'); setIsOpen(false);}}>
            <Users size={20} /> 회원 관리
            </NavItem>
            <NavItem $active={current_view === 'application'} onClick={() => {setView('application'); setIsOpen(false);}}>
            <UserPlus size={20} /> 가입 관리
            </NavItem>
            <NavItem $active={current_view === 'event'} onClick={() => {setView('event'); setIsOpen(false);}}>
            <Calendar size={20} /> 일정 관리
            </NavItem>
            <NavItem $active={current_view === 'notice'} onClick={() => {setView('notice'); setIsOpen(false);}}>
            <Bell size={20} /> 공지사항
            </NavItem>
        </NavList>
        </Sidebar>
    </>
    )
}