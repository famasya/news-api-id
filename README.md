# News API ID

A Cloudflare Worker-based API for accessing Indonesian news feeds from various news sources.

## API Endpoints

- GET `/rss/:channel/:category`

## Available Channels

- `kompas`
- `antaranews`
- `cnn`
- `liputan6`

## Available Categories

Visit index page to see available categories.

## Usage Examples

```bash
# Get all Kompas news
curl [https://news-api-id.famasya.workers.dev/rss/kompas/all](https://news-api-id.famasya.workers.dev/rss/kompas/all)

# Get Antara news (defaults to terkini if category is not valid)
curl [https://news-api-id.famasya.workers.dev/rss/antaranews/terkini](https://news-api-id.famasya.workers.dev/rss/antaranews/terkini)

# Get CNN Indonesia news
curl [https://news-api-id.famasya.workers.dev/rss/cnn/nasional](https://news-api-id.famasya.workers.dev/rss/cnn/nasional)

# Get Liputan6 news
curl [https://news-api-id.famasya.workers.dev/rss/liputan6/news](https://news-api-id.famasya.workers.dev/rss/liputan6/news)
