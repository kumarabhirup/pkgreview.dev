import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSpring, animated } from 'react-spring'

import { meta } from '../src/api/meta'
import { Container, Header, Footer, Spacing } from '../src/lib/styles/styled'
import { fadeInWithRotation } from '../src/lib/reactSpringAnimations'
import MainUi from '../src/components/Body'

export default function HomePage() {
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
              <h1>pkgreview.dev</h1>
            </Header>
          </Link>

          <Spacing />

          <MainUi>
            See{' '}
            <code className="block accent fixed" style={{ display: 'inline' }}>
              pkgreview.dev/npm/package-name
            </code>{' '}
            for reviews. Webpage still under development.
          </MainUi>

          <Spacing />

          <Footer className="block accent fixed">
            pkgreview.dev ‒ created by{' '}
            <Link href="https://twitter.com/kumar_abhirup">
              <a
                style={{
                  color: '#fff',
                  fontStyle: 'italic',
                  textDecoration: 'none',
                }}
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
