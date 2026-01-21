import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryHover: string;
      textMain: string;
      textMuted: string;
      white: string;
    };
    breakpoints: {
      tablet: string;
      desktop: string;
    };
  }
}
