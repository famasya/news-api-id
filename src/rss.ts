import { XMLParser } from "fast-xml-parser";
import { Context } from "hono";
import { BlankEnv } from "hono/types";

export type FeedItem = {
  rss: {
    channel: {
      title: string
      link: string
      description: string
      item: Array<{
        title: string
        link: string
        description: string
        pubDate: string
        thumb: string
      }>
    }
  }
}

type ItemResponse = {
  title: string
  link: string
  thumbnail?: string
  description: string
  published_at: string
}
export const feedResolver = {
  kompas: (_: string) => {
    return {
      categories: ["news"],
      url: "https://rss.kompas.com/api/feed/social?apikey=bc58c81819dff4b8d5c53540a2fc7ffd83e6314a"
    }
  },
  antaranews: (category: string) => {
    const categories = ["terkini", "video", "politik", "ekonomi", "bola", "hukum", "teknologi", "metro", "sepakbola", "olahraga", "humaniora", "lifestyle", "hiburan", "dunia", "infografik"]
    return {
      categories: categories,
      url: `https://antaranews.com/rss/${categories.includes(category) ? category : "terkini"}`
    }
  },
  detik: (category: string) => {
    const categories = ["news", "finance", "inet"];
    return {
      categories,
      url: categories.includes(category) ? `https://${category}.detik.com/googlenews/rss` : `https://news.detik.com/googlenews/rss`
    }
  },
  cnn: (category: string) => {
    const categories = ["nasional", "internasional", "ekonomi", "olahraga", "otomotif", "teknologi", "hiburan", "gaya-hidup"]
    return {
      categories: categories,
      url: `https://www.cnnindonesia.com/${categories.includes(category) ? category : "nasional"}/rss`
    }
  },
  liputan6: (category: string) => {
    const categories = ["news", "bisnis", "bola", "showbiz", "tekno", "foto", "hot", "islami", "crypto", "saham", "regional", "otomotif", "opini", "disabilitas", "global", "surabaya", "lifestyle", "health", "cek-fakta"]
    return {
      categories: categories,
      url: `https://feed.liputan6.com/rss/${categories.includes(category) ? category : "news"}`
    }
  }
};

const parser = new XMLParser();
export const rssRoutes = async (c: Context<BlankEnv, "/news/:channel/:category", any>) => {
  const { channel, category } = c.req.param()

  const cacheKey = c.req.raw
  const cache = caches.default
  let response = await cache.match(cacheKey)

  // return cached response if available
  if (response) {
    return response
  }

  const channelConfig = feedResolver[channel as keyof typeof feedResolver];
  if (!channelConfig) {
    return c.json({
      error: "Channel not found"
    }, 404);
  }
  const { url, categories } = channelConfig(category)
  let data = await fetch(url, {
    cf: {
      cacheTtl: 5 * 60, // always cache this request for 5 minutes
      cacheEverything: true,
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    },
  })

  const result = parser.parse(await data.text()) as FeedItem
  const items: ItemResponse[] = result.rss.channel.item.map(i => ({
    title: i.title,
    link: i.link,
    description: i.description,
    published_at: i.pubDate,
    thumbnail: i.thumb
  }))

  const jsonResponse = c.json({
    categories: categories,
    cached_at: new Date().toISOString(),
    items: items
  }, 200, {
    "Cache-Control": "max-age=300, stale-while-revalidate=600"
  })

  // cache response
  await cache.put(cacheKey, jsonResponse.clone())
  return jsonResponse
}
