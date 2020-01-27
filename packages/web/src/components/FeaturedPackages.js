import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { featuredPackages } from '../api/meta'

const Grid = styled.section`
  display: grid;
  grid-template-columns: auto auto auto;
`

export default function FeaturedPackages() {
  return (
    <Grid id="featuredPackages">
      {featuredPackages.map(({ name, type, image, link }, index) => (
        <Link key={index} href={`/${type}/${link}`}>
          <article className="block">
            <img
              width="100"
              src={image}
              alt={`${name} ${type} package`}
              loading="lazy"
              style={{ marginTop: '3px' }}
            />
            <h2 style={{ lineHeight: '0px' }}>{name}</h2>
          </article>
        </Link>
      ))}
    </Grid>
  )
}
