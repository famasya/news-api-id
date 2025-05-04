import { Hono } from 'hono';
import { renderer } from './renderer';
import RoutesPage from './route';
import { rssRoutes } from './rss';

export type Bindings = {
  NODE_ENV: "development" | "production";
};
const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(RoutesPage())
})
app.get('/rss/:channel/:category', rssRoutes)

export default {
  fetch: app.fetch,
}
