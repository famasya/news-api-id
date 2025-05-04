import { ItemResponse } from "./rss"

type KumparanResponse = {
  data: {
    FindStoryFeedByChannelSlug: {
      edges: Array<{
        id: string
        title: string
        leadText: string
        slug: string
        publishedAt: string
        leadMedia: Array<{
          id: string
          publicID: string
          externalURL: string
          awsS3Key: string
          mediaType: string
          width: number
          height: number
        }>
      }>
      cursorInfo: {
        hasMore: boolean
        cursor: string
        nextCursor: string
      }
    }
  }
}

export const kumparanNews = async (category: string) => {
  const data = await fetch("https://graphql-v4.kumparan.com/query?deduplicate=1", {
    body: JSON.stringify(
      {
        "operationName": "FindStoryFeedByChannelSlug",
        "variables": {
          "channelSlug": category,
          "cursor": new Date().toISOString(),
          "size": 20,
          "cursorType": "BEFORE",
          "userAliasID": "1ff594a4-0c69-4bf0-bb5e-753f798f08bd"
        },
        "query": "query FindStoryFeedByChannelSlug($channelSlug: String!, $userAliasID: ID, $size: Int!, $cursor: String!, $cursorType: CursorType!) {\n  FindStoryFeedByChannelSlug(\n    channelSlug: $channelSlug\n    userAliasID: $userAliasID\n    cursorType: $cursorType\n    size: $size\n    cursor: $cursor\n  ) {\n    edges {\n      id\n      title\n      leadText\n      slug\n      publishedAt\n      leadMedia {\n        id\n        publicID\n        externalURL\n        mediaType\n        width\n        height\n      }\n    }\n    cursorInfo {\n      hasMore\n      cursor\n      nextCursor\n    }\n  }\n}"
      }
    ),
    method: "POST"
  })
  const jsonResponse = await data.json() as KumparanResponse
  const items: ItemResponse[] = jsonResponse.data.FindStoryFeedByChannelSlug.edges.map(i => {
    return {
      title: i.title,
      link: `https://kumparan.com/${category}/${i.slug}`,
      description: i.leadText,
      published_at: i.publishedAt,
      thumbnail: i.leadMedia[0].externalURL
    }
  })
  return items
}
