import styled from "styled-components";

export const Spinner = (color?:string) => <LoaderWrapper color={color}></LoaderWrapper>;
    const LoaderWrapper = styled.div<{color?:string}>`
      border: 4px solid rgba(243, 243, 243, 0);
      border-top: ${props => `4px solid ${props.color}`};
      border-radius: 50%;
      width: 20px;
      height: 20px;
      margin:0 auto;
      animation: spin 600ms linear infinite;
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;