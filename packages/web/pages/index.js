import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSpring, animated } from 'react-spring'

import { meta } from '../src/api/meta'
import { Container, Header, Footer, Spacing } from '../src/lib/styles/styled'
import { fadeInWithRotation } from '../src/lib/reactSpringAnimations'
import AnimatedMailUi from '../src/components/AnimatedMailUi'

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
              <h1>💌 AdventMail</h1>
            </Header>
          </Link>
          <Spacing />
          <AnimatedMailUi />
          <Spacing />
          <Footer className="block accent fixed">This is the footer.</Footer>
        </Container>
      </animated.div>
    </>
  )
}
