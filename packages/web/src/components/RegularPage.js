import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSpring, animated } from 'react-spring'
import PropTypes from 'prop-types'

import { meta } from '../api/meta'
import { Container, Header, Footer, Spacing } from '../lib/styles/styled'
import { fadeInWithRotation } from '../lib/reactSpringAnimations'
import SearchBox from './SearchBox'
import ProvideUser from './ProvideUser'
import Login from './Login'
import SignOut from './SignOut'
import cookies from '../lib/cookies'

export default function RegularPage({ children }) {
  const fadeIn = useSpring(fadeInWithRotation)

  const router = useRouter()

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <animated.div style={{ ...fadeIn }}>
        <Container>
          <Link href="/">
            <Header className="block accent" id="loginSection">
              <h1>{meta.name}</h1>
            </Header>
          </Link>

          <p className="loginText">
            <ProvideUser>
              {({ data, error, loading }) => {
                if (error)
                  return (
                    <>
                      There's an error.{' '}
                      <button
                        className="block"
                        style={{ display: 'inline' }}
                        type="button"
                        onClick={() => {
                          if (cookies.get('pkgReviewToken')) {
                            cookies.remove('pkgReviewToken', { path: '/' })

                            router.reload()
                          }
                        }}
                      >
                        Click here
                      </button>{' '}
                      to get things work properly.
                    </>
                  )

                if (loading) return `Loading...`

                if (data?.getCurrentUser?._id)
                  return (
                    <>
                      <span>Heya 👋 {data.getCurrentUser.name}!</span>
                      <span>&nbsp;•&nbsp;</span>
                      <SignOut className="loginText underline pointer">
                        Sign Out
                      </SignOut>
                    </>
                  )

                return (
                  // <div id="loginSection">
                  <Login />
                  // </div>
                )
              }}
            </ProvideUser>
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
