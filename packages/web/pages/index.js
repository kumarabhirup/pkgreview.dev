import React from 'react'
import Markdown from 'markdown-to-jsx'

import RegularPage from '../src/components/RegularPage'
import Block from '../src/components/Block'
import Login from '../src/components/Login'
import SearchBox from '../src/components/SearchBox'
import FeaturedPackages from '../src/components/FeaturedPackages'

import markdown from '../src/markdown/homepage.md'

export default function HomePage() {
  return (
    <RegularPage>
      <Block>
        <>
          <Markdown
            style={{
              zoom: '1.2',
              maxWidth: '600px',
              width: '98%',
              lineHeight: '50px',
            }}
            options={{
              overrides: {
                Login: {
                  component: Login,
                },
                Searchbox: {
                  component: SearchBox,
                  props: {
                    limit: 2,
                  },
                },
                FeaturedPackages: {
                  component: FeaturedPackages,
                  props: {
                    limit: 2,
                  },
                },
              },
            }}
          >
            {markdown}
          </Markdown>
        </>
      </Block>
    </RegularPage>
  )
}
