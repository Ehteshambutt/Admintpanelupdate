// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <img src="https://ottoman-front-end.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSosoft-logo.f9e30428.png&w=384&q=75" width="50px"/>
      <img src="https://ottoman-front-end.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSosoft-logo.f9e30428.png&w=384&q=75" width="50px"/>    
            {/* <link rel='shortcut icon' href='https://ottoman-front-end.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FSosoft-logo.f9e30428.png&w=384&q=75' /> */}
         </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        )
    })
  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)

  const emotionStyleTags = emotionStyles.styles.map(style => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
      />
    )
  })

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}

export default CustomDocument
