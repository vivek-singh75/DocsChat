# DocsChat frontend

## Run locally

Start the backend on port `4000`, then run the frontend:

```sh
npm install
npm run dev
```

Vite proxies `/api` requests to `http://localhost:4000`.

## Frontend layers

- `src/api/` — upload and question HTTP requests
- `src/hooks/` — upload, conversation, and inactivity-session state
- `src/ui/` — reusable icons and the chat workspace interface
- `src/App.jsx` — page layout and UX orchestration

## Backend response contract

The frontend sends a PDF as `docsFile` to `POST /api/docs/upload` and expects `success`, `message`, `sessionId`, and `document` metadata (`fileName`, `totalPages`, and `totalChunks`). It sends questions as JSON `{ sessionId, userQuery }` to `POST /api/user/question` and displays the returned `response` string.
