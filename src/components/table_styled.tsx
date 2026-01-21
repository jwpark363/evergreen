import styled from "styled-components";

export const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  th {
    background: #f8fafc;
    padding: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
  }
  td {
    padding: 8px;
    font-size: 13px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }
`;
export const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 4px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  background: ${props => props.$active ? '#1e293b' : '#f1f5f9'};
  color: ${props => props.$active ? 'white' : '#94a3b8'};
`;
export const IconButton = styled.button<{ $color?: string }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$color || '#94a3b8'};
  transition: color 0.2s;
  &:hover { color: ${props => props.$color ? '#c53030' : '#4a5568'}; }
`;
