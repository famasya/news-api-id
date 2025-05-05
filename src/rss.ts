import { XMLParser } from "fast-xml-parser";
import { Context } from "hono";
import { BlankInput } from "hono/types";
import { Bindings as CFBindings } from "./";
import { kumparanNews } from "./kumparan";
import { tempoNews } from "./tempo";

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

export type ItemResponse = {
  title: string
  link: string
  thumbnail?: string
  description: string
  published_at: string
}
export const feedResolver = {
  kompas: (_: string) => {
    return {
      categories: ["all"],
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
  },
  kumparan: (_: string) => {
    const categories = ["news", "entertainment", "tekno-sains", "bisnis", "food-travel", "otomotif", "bola-sports", "woman", "mom", "bolanita"];
    return {
      categories: categories,
      url: null,
    }
  },
  cnbc: (category: string) => {
    const categories = ["market", "news", "entrepreneur", "syariah", "tech", "lifestyle", "opini", "mymoney", "cuap-cuap-cuan", "research"]
    return {
      categories: categories,
      url: `https://www.cnbcindonesia.com/${categories.includes(category) ? category : "news"}/rss`
    }
  },
  tempo: (_: string) => {
    const categories = ["all", "politik", "hukum", "ekonomi", "lingkungan", "wawancara", "sains", "investigasi", "cekfakta", "kolom", "hiburan", "internasional", "arsip", "otomotif", "olahraga", "sepakbola", "digital", "gaya", "teroka", "prelude", "tokoh", "video", "foto", "data", "infografik", "pemilu", "newsletter", "info", "ramadan"];
    return {
      categories: categories,
      url: null,
    }
  },
  inews: (_: string) => {
    return {
      categories: ["all"],
      url: "https://www.inews.id/feed",
    }
  }
};

const parser = new XMLParser();
const trimHtmlTags = (html: string) => html.replace(/<[^>]*>/g, "");
export const rssRoutes = async (context: Context<{ Bindings: CFBindings; }, "/rss/:channel/:category", BlankInput>) => {
  const { channel, category } = context.req.param()
  const { NODE_ENV } = context.env
  const cacheKey = context.req.raw
  const cache = caches.default
  let response = await cache.match(cacheKey)

  // return cached response if available
  if (response && NODE_ENV !== "development") {
    return response
  }

  const channelConfig = feedResolver[channel as keyof typeof feedResolver];
  if (!channelConfig) {
    return context.json({
      error: "Channel not found"
    }, 404);
  }

  let items: ItemResponse[] = []
  const { url, categories } = await channelConfig(category)
  if (url) {
    let data = await fetch(url, {
      cf: {
        // disable cache in development
        cacheTtl: NODE_ENV !== "development" ? 5 * 60 : undefined,
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
    items = result.rss.channel.item.map(i => ({
      title: i.title,
      link: i.link,
      description: trimHtmlTags(i.description).trim(),
      published_at: new Date(i.pubDate).toISOString(),
      thumbnail: i.thumb
    }))
  } else if (channel === "kumparan") {
    items = await kumparanNews(categories.includes(category) ? category : "news")
  } else if (channel === "tempo") {
    items = await tempoNews(categories.includes(category) ? category : "all")
  }

  const jsonResponse = context.json({
    available_categories: categories,
    cached_at: new Date().toISOString(),
    items: items
  }, 200, NODE_ENV !== "development" ? {
    "Cache-Control": "max-age=300, stale-while-revalidate=600"
  } : undefined)

  // cache response
  await cache.put(cacheKey, jsonResponse.clone())
  return jsonResponse
}
