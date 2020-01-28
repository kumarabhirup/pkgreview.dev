import React from 'react'
import Head from 'next/head'

import { meta } from '../api/meta'

export default function Meta() {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="shortcut icon" href="/static/pkgreview.ico" />

      <title>{meta.title}</title>

      <meta name="description" content={meta.metaDescription} />
      <meta name="copyright" content={meta.name} />
      <meta name="robots" content="index,follow" />
      <meta name="author" content={`${meta.author}, ${meta.email}`} />
      <meta name="url" content={meta.domain} />
      <meta name="identifier-URL" content={meta.domain} />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />

      <meta property="og:title" content={meta.metaOgTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.domain} />
      <meta property="og:image" content={meta.coverImage} />
      {/* <meta name="fb:page_id" content={meta.fbPageId} /> */}

      <meta name="twitter:title" content={meta.metaOgTitle} />
      <meta name="twitter:description" content={meta.metaDescription} />
      <meta name="twitter:image" content={meta.coverImage} />
      <meta name="twitter:image:alt" content={meta.metaOgTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={`@${meta.social}`} />
      <meta name="twitter:creator" content={`@${meta.social}`} />
    </Head>
  )
}
