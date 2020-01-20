import Document, { Head, Main, NextScript } from 'next/document'
import { withRouter } from 'next/router'
import { ServerStyleSheet } from 'styled-components'

// To render styles on the server-side (for styled-components)
class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const isProduction = process.env.NODE_ENV === 'production'
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      // eslint-disable-next-line react/jsx-props-no-spreading
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    const router = withRouter(this)
    return { ...page, styleTags, router, isProduction }
  }

  setGoogleTags = () => ({
    __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.PR_GA_TRACKING_ID}');
      `,
  })

  render() {
    return (
      <html lang="en">
        <Head>
          {this.props.styleTags}

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/thesephist/blocks.css/src/blocks.css"
            type="text/css"
          />
        </Head>
        <body style={{ padding: 0, margin: 0 }}>
          <noscript>
            <div
              style={{
                width: '900px',
                margin: '20% auto',
                textAlign: 'center',
              }}
            >
              <h2>
                It's pity that you wanna live in a{' '}
                <span style={{ color: 'red' }}>world without JavaScript!</span>{' '}
                🌎
              </h2>
            </div>
          </noscript>

          <Main />
          <NextScript />

          {this.props.isProduction && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.PR_GA_TRACKING_ID}`}
              />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={this.setGoogleTags()}
              />
            </>
          )}

          <Head>{/* Custom Scripts Here */}</Head>
        </body>
      </html>
    )
  }
}

export default MyDocument
