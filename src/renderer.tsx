import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link
          href={import.meta.env.PROD ? `/assets/style.css` : `/src/style.css`}
          rel="stylesheet"
        />
        <title>News API ID - API Berita Bahasa Indonesia</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
