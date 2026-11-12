# Katsu's Pet Supply

A fictional storefront for teaching goal and conversion tracking. All products, revenue, addresses, and orders are pretend. No payments, personal details, or real navigation are collected.

## Run locally

From this folder, run `python3 -m http.server 8080`, then open `http://localhost:8080`. The site uses static HTML, CSS, and JavaScript modules; no build or package installation is required. Google Fonts is optional; system fonts are used if unavailable.

## Publish

Deploy this folder as a static site. On GitHub Pages, publish the `main` branch from the repository root. All links and asset paths support a repository subdirectory.

## Tracking

The storefront does not expose a tracking playground or event-log page. Conversion tracking remains active behind the shopping and store journeys. Events are emitted through `window.dataLayer`, `window.uetq`, and the `katsu:tracking` custom event. The latest 50 demo events are also stored in the browser under the `katsu-events` local-storage key for developer inspection; this log is not a delivery receipt from an analytics platform.

For Microsoft Advertising, set `UET_TAG_ID` in `config.js` to a dedicated test tag ID and republish. The shared script loads UET on every page. No external analytics tag loads until configured. Use test reporting only: all conversions and revenue are fictional. Establish any required consent behavior before enabling third-party tracking or adapting this into a production site.

| Action | Event | Destination |
| --- | --- | --- |
| Open a page | `page_view` | Current page |
| Open product details | `view_item` | Product dialog |
| Add a product | `add_to_cart` | Current page |
| Open populated checkout | `begin_checkout` | `/checkout/` |
| Complete a pretend order | `purchase` | `/thank-you/` |
| View the fictional store | `store_visit` | `/store/` |
| Click demo directions | `get_directions` | `/directions/` |

UET event category is `katsu_demo`. The purchase event supplies `revenue_value` and `currency: USD` to UET, and `value`, `currency`, `transaction_id`, and `items` to the data layer. Revenue includes pretend shipping ($4.95 below $50; free at $50 or for pickup). Demo tax is zero.

Destination goal paths must include the GitHub Pages repository prefix, when applicable. Event-based purchase goals are preferable: directly visiting or refreshing a confirmation URL can trigger a destination goal without a new purchase. The purchase event is emitted once per latest order using a local-storage marker; this is not server-side deduplication or server-to-server conversion tracking.

Local storage holds the shopping bag, latest demo order, and event log. Checkout requires working local storage. Product quantities are limited to 1–99. Use browser site-data settings to reset all demo state.
