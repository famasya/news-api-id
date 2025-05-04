import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <Style>{css`
          body {
            font-family: Arial, Helvetica, sans-serif;
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
