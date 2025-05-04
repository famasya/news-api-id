import { feedResolver } from "./rss";

export default function RoutesPage() {
  const channels = Object.keys(feedResolver)

  return <>
    <h3>Available routes</h3>
    <p>Results are cached for 5 minutes.</p>
    {channels.map((channel) => (
      <>
        <h4>{channel}</h4>
        <ul>
          {feedResolver[channel as keyof typeof feedResolver]("").categories.map((category) => (
            <li key={category}><a href={`/rss/${channel}/${category}`}>rss/{channel}/{category}</a></li>
          ))}
        </ul>
      </>
    ))}
  </>
}
