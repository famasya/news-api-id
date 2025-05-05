[![Deploy](https://github.com/famasya/news-api-id/actions/workflows/main.yml/badge.svg)](https://github.com/famasya/news-api-id/actions/workflows/main.yml)
# News API ID

A Cloudflare Worker-based API for accessing Indonesian news feeds from various news sources.

## API Endpoints

- GET `/rss/:channel/:category`

## Available Channels and Categories

Visit index page to see.

## Usage Examples

```bash
# Get all Kompas news
curl https://news-api-id.famasya.workers.dev/rss/kompas/news

# Get Antara news (defaults to terkini if category is not valid)
curl https://news-api-id.famasya.workers.dev/rss/antaranews/terkini

# Get CNN Indonesia news
curl https://news-api-id.famasya.workers.dev/rss/cnn/nasional

# Get Liputan6 news
curl https://news-api-id.famasya.workers.dev/rss/liputan6/news
