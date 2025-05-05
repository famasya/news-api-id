import parse from "node-html-parser";
import { ItemResponse } from "./rss";

export const idntimesNews = async (category: string) => {
  const data = await fetch("https://www.idntimes.com/ajax/category-ajax/" + category, {
    headers: {
      referrer: "https://www.idntimes.com" + category,
      "x-requested-with": "XMLHttpRequest"
    }
  })

  const root = parse(await data.text());
  const divs = root.querySelectorAll(".box-latest")
  const items: ItemResponse[] = []
  for (const div of divs) {
    const a = div.querySelector("a")
    const title = a?.getAttribute("title") ?? ""
    const link = a?.getAttribute("href") ?? ""
    const thumbnail = div.querySelector("img")?.getAttribute("data-src")?.replace("_300x200", "") ?? ""
    const [date, time] = div.querySelector("time")?.getAttribute("datetime")?.split("|") ?? []
    const publishedAt = new Date(date.trim() + " " + time.trim()).toISOString()
    if (a) {
      items.push({
        title: title,
        link: link,
        description: title,
        published_at: publishedAt,
        thumbnail: thumbnail
      })
    }
  }

  return items
}
