import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <Style>{css`
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            padding: 20px;
          }

          h4 {
            margin: 0px;
          }

          body ul {
            padding-left: 20px;
            margin: 5px;
          }

          body a {
            text-decoration: none;
          }
        `}</Style>
        <title>News API ID - API Berita Bahasa Indonesia</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
