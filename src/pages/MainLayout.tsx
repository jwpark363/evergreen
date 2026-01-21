import styled from "styled-components";
import DashboardView from "./DashBoard";
import type { ROUTER } from '../types/router_types';
import { SideBar } from "../components/sidebar";
import MemberView from "./Member";
import ApplicationView from "./Application";
import EventView from "./Event";
import NoticeBoard from "./Notice";
import { useEffect } from "react";
import LoginModal from "../components/login_modal";
import { currentUser } from "../api/login_api";
import { useLoginStore } from "../state/login_state";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;
const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  @media (max-width: 724px) { padding: 60px 12px; }
  .header{
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: 42px;
    img{
      width: 64px;
    }
    p{
      font-size: 24px;
      font-weight: bold;
    }
  }
`;
interface MainLayoutProps{
  current_view: ROUTER,
  setView: (menu:ROUTER) => void
}
export default function MainLayout({ current_view, setView }: MainLayoutProps){
  const {user, setUser} = useLoginStore();
  // const [is_login, setLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await currentUser();
      if(result && result.login_user){
        setUser(result.login_user)
        // setLogin(true);
      }
    })();
  },[current_view])
  // 실제 콘텐츠 렌더링 함수
  const renderContent = () => {
    switch (current_view) {
      case 'dashboard': return <DashboardView setView={(view) => setView(view)}/>;
      case 'member': return <MemberView />;
      case 'application': return <ApplicationView />;
      case 'event': return <EventView />;
      case 'notice': return <NoticeBoard />;
      default: return <DashboardView setView={(view) => setView(view)}/>;
    }
  };
  if(current_view !== 'dashboard' && !user)
    return <LoginModal setView={setView}/>
  else
    return (
      <Container>
        <SideBar current_view={current_view} setView={setView}/>
        <MainContent>
          <div className="header">
            <img src="https://raw.githubusercontent.com/fcevergreen/images/refs/heads/main/soccer.png" />
            <p>늘푸른 축구회</p>
          </div>
          {renderContent()}
        </MainContent>
      </Container>
    );
};