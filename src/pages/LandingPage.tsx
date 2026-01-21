import styled, { useTheme } from 'styled-components';
import { ArrowRight, Calendar, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { CLUB_INFO } from '../datas/intro';
import { ApplicationModal } from '../components/application_modal';
import { useState } from 'react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #eff6ff, #ffffff);
`;
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;
const Header = styled.header`
  padding: 4rem 0;
  text-align: center;
`;
const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.textMain};
  margin-bottom: 1.5rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
`;
const Button = styled.button<{$primary?:boolean}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  background-color: ${props => props.$primary ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.$primary ? props.theme.colors.white : props.theme.colors.textMain};
  border: ${props => props.$primary ? 'none' : '1px solid #d1d5db'};
  &:hover {
    background-color: ${props => props.$primary ? props.theme.colors.primaryHover : '#f3f4f6'};
  }
`;
const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
const StyledCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: left;
`;
  const ShowIcon = (icon_type:string) => {
    if(icon_type === "user") return <Users className="h-10 w-10 text-blue-600 mb-2" />
    if(icon_type === "calendar") return <Calendar className="h-10 w-10 text-blue-600 mb-2" />
    if(icon_type === "up") return <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
    if(icon_type === "message") return <MessageSquare className="h-10 w-10 text-blue-600 mb-2" />
    return null
  }

interface LandingPageProps{
  onEnter: () => void
}
export default function LandingPage({onEnter}:LandingPageProps){
  const [is_formopen, setFormOpen] = useState(false);
  const theme = useTheme();
  return (
  <>
    <PageWrapper>
      <Header>
        <Container>
          <Title>함께 성장하는 {CLUB_INFO.name}</Title>
          <p style={{ color: theme.colors.textMuted, fontSize: '1.25rem', marginBottom: '2rem' }}>
            {CLUB_INFO.motto}...
          </p>
          <div style={{ maxWidth: '800px', margin: '0 auto 2rem', borderRadius: '1rem', overflow: 'hidden' }}>
              <img 
                src="https://raw.githubusercontent.com/fcevergreen/images/refs/heads/main/evergreen.png" 
                alt="evergreen" 
                style={{ width: '100%', display: 'block' }}
              />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button $primary={true} onClick={()=>setFormOpen(true)}>가입 신청하기 <ArrowRight size={18} /></Button>
            <Button onClick={()=>onEnter()}>사이트 둘러보기</Button>
          </div>
        </Container>
      </Header>
      <Container style={{ paddingBottom: '5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>늘푸른 축구회의 특별함</h2>
        <CardGrid>
          {CLUB_INFO.features.map((feature,i) => 
            <StyledCard key={i}>
              {ShowIcon(feature.icon)}
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.name}</h4>
              <p style={{ color: theme.colors.textMuted, fontSize: '0.875rem' }}>{feature.description}</p>
            </StyledCard>
          )}
        </CardGrid>
      </Container>

      <footer style={{ background: '#111827', color: '#9ca3af', padding: '2rem 0', textAlign: 'center' }}>
        <p>© {CLUB_INFO.since} {CLUB_INFO.name}. All rights reserved.</p>
      </footer>
    </PageWrapper>
    {is_formopen && <ApplicationModal is_open={is_formopen} onClose={()=>setFormOpen(false)}/>}
  </>
  );
};