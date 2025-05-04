import { ItemResponse } from "./rss";

interface ArticleResponse {
  response_code: number;
  status: string;
  message: string;
  data: Article[];
}

interface Article {
  title_digital: string; // Using title_digital as the main title
  canonical_url: string; // Using canonical_url as the link
  description: string;
  published_at: string;
  feature_image: string; // Using feature_image as the thumbnail
}

export const tempoNews = async (category: string) => {
  const data = await fetch("https://www.tempo.co/api/gateway/articles?status=published&limit=20&page_size=20&order_published_at=DESC&rubric_slug=" + category.replaceAll("all", ""))
  const result = await data.json() as ArticleResponse
  const items: ItemResponse[] = result.data.map(i => {
    return {
      title: i.title_digital,
      link: i.canonical_url,
      description: i.description,
      published_at: i.published_at,
      thumbnail: i.feature_image
    }
  })
  return items
}
