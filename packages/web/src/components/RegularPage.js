import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSpring, animated } from 'react-spring'
import { PropTypes } from 'prop-types'
import GitHubLogin from 'react-github-login'

import { meta } from '../api/meta'
import { Container, Header, Footer, Spacing } from '../lib/styles/styled'
import { fadeInWithRotation } from '../lib/reactSpringAnimations'
import SearchBox from './SearchBox'

export default function RegularPage({ children }) {
  const fadeIn = useSpring(fadeInWithRotation)

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <animated.div style={{ ...fadeIn }}>
        <Container>
          <Link href="/">
            <Header className="block accent">
              <h1>{meta.name}</h1>
            </Header>
          </Link>

          <p>
            <GitHubLogin
              clientId={process.env.PR_GITHUB_CLIENT_ID}
              className="loginText"
              buttonText="Sign In with GitHub 😻 to Post and Moderate reviews"
              redirectUri=""
              scope="read:user read:repo"
              onSuccess={onSucces => {
                console.log(onSucces)
              }}
              onFailure={onFailure => console.log(onFailure)}
            />
          </p>

          <SearchBox />

          <Spacing />

          {children}

          <Spacing />

          <Footer className="block accent fixed">
            {meta.name} ‒ created by{' '}
            <Link href="//twitter.com/kumar_abhirup">
              <a
                style={{
                  color: '#fff',
                  fontStyle: 'italic',
                  textDecoration: 'none',
                }}
                target="_blank"
              >
                @kumar_abhirup
              </a>
            </Link>
          </Footer>
        </Container>
      </animated.div>
    </>
  )
}

RegularPage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
}
