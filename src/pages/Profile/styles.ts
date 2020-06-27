import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        height: 30px;
        width: 30px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -180px auto 0;

  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    > h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    h1 {
      margin-top: 24px;
      font-size: 20px;
      text-align: left;
    }

    a {
      display: block;
      margin-top: 24px;
      color: #f4ede8;
      text-decoration: none;
      transition: color 200ms;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }

    button {
      margin-top: 24px;
    }
  }
`;

export const AvatarInput = styled.label`
  margin-bottom: 32px;
  position: relative;
  outline: none;
  background: transparent;
  border: none;

  cursor: pointer;

  &:hover {
    div {
      background-color: ${shade(0.2, '#ff9000')};
    }
  }

  input {
    display: none;
  }

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  div {
    background: #ff9000;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    position: absolute;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;

    transition: background-color 200ms;

    svg {
      color: #232129;
      width: 20px;
      height: 20px;
    }
  }
`;
