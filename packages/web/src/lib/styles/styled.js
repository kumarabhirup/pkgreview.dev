import styled from 'styled-components'

export const Container = styled.main`
  font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
    'Arial', sans-serif;
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
  }

  a.nextApp:hover {
    border-bottom: 1px solid #0076ff;
  }
`

export const Header = styled.header`
  line-height: 20px;

  a {
    color: #ffffff;
    text-decoration: none;
  }
`

export const Body = styled.section`
  padding: 20px;
  text-align: center;
`

export const UploadButton = styled.button`
  font-size: 2.25vh;
`

export const Spacing = styled.div`
  padding: 5px;
  clear: both;
`

export const Footer = styled.footer``
