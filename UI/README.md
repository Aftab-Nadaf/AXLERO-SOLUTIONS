# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Dashboard API configuration

The sidebar is organized around the available backend: Dashboard, Products,
Inventory, Recommendations, and API Gateway.

The dashboard loads the catalog with `GET /products/products` and checks inventory
with `GET /inventory/inventory/{productId}`. The API Gateway page also sends
requests through the service-prefixed gateway routes: product details
(`/products/products/{productId}`) and recommendations
(`/api/recommendations/{userId}`). During development, Vite proxies these routes
and `/actuator/*` to `http://localhost:8083`. Set `VITE_API_GATEWAY_URL` to the
gateway origin in a local `.env.local` file when the UI needs to call it directly. The recommendation
page reports whether results came from the service or the gateway fallback;
start the recommendation service on port `8082` and register it with Eureka for
live service results. Both the service and gateway fallback identify their
response source with the `X-Recommendation-Source` response header.

The dashboard reads gateway health and the exposed HTTP request, Resilience4j
circuit-breaker, executor, and Logback metrics from `/actuator` through the API
gateway. The rate-limit panel reads the `X-RateLimit-Limit` and
`X-RateLimit-Remaining` headers from the latest recommendation request.
Actuator metrics refresh with the dashboard refresh button. Counters and timing
values are live gateway-wide aggregates, including Actuator requests made by
the UI. Logback exposes aggregate counts only, not individual log entries.

Distributed traces are read from Zipkin through `GET /api/traces` on the
gateway. The gateway and product, inventory, and recommendation services export
sampled spans to `ZIPKIN_ENDPOINT` (defaults to
`http://localhost:9411/api/v2/spans`). The gateway queries recent traces from
`ZIPKIN_QUERY_URL` (defaults to `http://localhost:9411/api/v2/traces`). Start a
Zipkin collector at that address, then restart the backend services and
gateway. Set `VITE_ZIPKIN_UI_URL` if the Zipkin UI is hosted at a different
address. Trace queries return a collector connection error when Zipkin is
unavailable; no sample traces are displayed.

Resilience control endpoints are not configured, so the dashboard does not
pretend to trigger backend chaos scenarios.
