import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
export const ModalContainer = styled.div`
  background: white;
  width: 480px;
  max-height: 90vh;
  border-radius: 12px;
  padding: 24px;
  overflow-y: auto;
  position: relative;
`;
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  h2 { font-size: 20px; font-weight: 700; }
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const FormGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  label {
    width: 100px;
    font-size: 14px;
    color: #4a5568;
    span { color: #f56565; margin-left: 2px; }
  }
  input, select, textarea {
    flex: 1;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 14px;
    outline: none;
    &:focus { border-color: #3b82f6; background: white; }
  }
  p{
    position: absolute;
    bottom: -26px;
    left: 12px;
    color: darkred;
    font-size: 12px;
  }
`;
export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  label {
    width: 100px;
    font-size: 14px;
    color: #4a5568;
    cursor: pointer;
    span { color: #f56565; margin-left: 2px; }
  }
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #0f172a;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    flex: none; 
  }
  .checkbox-label {
    font-size: 14px;
    color: #718096;
    cursor: pointer;
  }
`;
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`;
export const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.$primary ? '#0f172a' : '#e2e8f0'};
  background: ${props => props.$primary ? '#0f172a' : 'white'};
  color: ${props => props.$primary ? 'white' : '#4a5568'};
`;