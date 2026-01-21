import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  * { box-sizing: border-box; }
`;

export default GlobalStyle;