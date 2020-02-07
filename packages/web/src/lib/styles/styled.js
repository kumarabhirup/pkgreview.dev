import styled from 'styled-components'

export const Container = styled.main`
  font-family: 'dankmono', 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue',
    'Helvetica', 'Arial', sans-serif;
  margin: 0 auto;
  padding: 0px;
  font-size: 16px;
  line-height: 1.65;
  text-align: center;

  width: 1100px;
  max-width: 98%;

  h1 {
    font-size: 45px;
  }

  a.nextApp {
    cursor: pointer;
    color: #0076ff;
    text-decoration: none;
    transition: all 0.2s ease;
    border-bottom: 1px solid white;
    word-break: break-all;
    word-wrap: break-word;
    overflow-wrap: break-word;
    /* hyphens: auto; */
  }

  a.nextApp:hover {
    border-bottom: 1px solid #0076ff;
  }

  .loginText {
    color: #000;
    font-family: 'dankmono';
    font-size: 20px;
    background: none;
    border: none;
  }

  .pointer {
    cursor: pointer;
  }

  .underline {
    text-decoration: underline;
  }

  .block {
    user-select: auto !important;
    -webkit-user-select: auto !important;
  }
`

export const Header = styled.header`
  line-height: 20px;
  display: inline-block;
  padding: 5px;

  a {
    color: #ffffff;
    text-decoration: none;
  }

  img {
    margin-top: '10px';
  }
`

export const Body = styled.section`
  padding: 20px;
  text-align: center;

  button.block.accent.reviewLoginButton {
    display: block !important;
    width: 100% !important;
    padding: 10px !important;
    font-size: 20px !important;
  }
`

export const UploadButton = styled.button`
  font-size: 2.25vh;
`

export const Spacing = styled.div`
  padding: 10px;
  clear: both;
`

export const Footer = styled.footer``

export const FlexContainer = styled.div`
  display: flex;
  /* border: 1px solid red; */

  h1 {
    line-height: 50px;
  }

  data > h3 {
    display: inline;
    border-bottom: 2px solid #000;
  }

  data {
    display: block;
    text-align: justify;
    margin-top: 5px;
  }

  h3 {
    display: inline;
  }

  p {
    text-align: justify;
    margin-top: 5px;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  @media (orientation: portrait) {
    flex-direction: column-reverse;

    & > * {
      /* border: 1px solid red; */
      margin: 0px auto;
      padding: 0px;
    }
  }

  @media (orientation: landscape) {
    & * {
      /* border: 0.1px solid red; */
      margin: 0px auto;
      padding: 0px;
    }

    & > :first-child {
      width: ${({ firstWidth }) => firstWidth || '60%'};
    }

    & > :last-child {
      width: ${({ lastWidth }) => lastWidth || '40%'};

      ${({ lastTextAlign }) => (lastTextAlign ? 'text-align: end;' : null)}
    }
  }
`

export const ReviewTextbox = styled.textarea`
  display: block;
  width: 100%;
  resize: vertical;
  font-family: 'dankmono';
  font-size: 25px;
  border: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px 0px;
`

export const SearchBoxStyledComponent = styled.form`
  display: block;
  width: 98%;
  z-index: 2;

  label > span {
    display: block;
    max-width: 95%;
    margin: 0px auto;
    text-align: left;
    padding-left: 20px;
  }

  input {
    width: 1100px;
    max-width: 95%;
    padding: 10px;
    font-size: 20px;
    font-family: 'dankmono';
    border: none;
  }
`

export const Grid = styled.section`
  display: grid;
  grid-template-columns: ${props =>
    `repeat(auto-fit, minmax(${props.elementWidth || '200px'}, auto))`};

  a {
    text-decoration: none;
  }
`

export const GithubSignInButton = styled.button`
  color: #fff;
  padding: 15px 30px;
  background: #000;
  border-radius: 20px;
  font-size: 20px;
  font-family: 'dankmono';
  cursor: pointer;
  transition: all 0.5s ease-out;

  display: flex;
  vertical-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;

  &:hover {
    background: #111111;
    transform: scale(1.1);
  }

  img {
    filter: invert(100%);
    width: 30px;
  }

  & > * {
    padding: 0px 10px;
  }
`
