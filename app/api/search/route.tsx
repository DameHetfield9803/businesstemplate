import { Hono } from "hono";
import { handle } from "hono/vercel";

// Define the result type to match your React component
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page-content" | "api";
}

const app = new Hono().basePath("/api");

app.get("/search", async (c) => {
  const query = c.req.query("q");

  if (!query) {
    return c.json([]); // Return an empty array if no query
  }

  // Generate search results dynamically based on the user's input
  const results: SearchResult[] = [
    {
      id: "1",
      title: `You searched for: ${query}`,
      description: `This is a dynamically generated description for the query: "${query}"`,
      type: "api",
    },
    {
      id: "2",
      title: `Another result for: ${query}`,
      description: `More dynamic content related to your search term: "${query}"`,
      type: "api",
    },
  ];

  return c.json(results); // Return the results as JSON
});

export const GET = handle(app);
export const POST = handle(app);
