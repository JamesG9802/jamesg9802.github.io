import { get_all_posts_static } from "lib/blog-store/data";
import HomePage from "./home";

export default async function App() {
  const posts = await get_all_posts_static();

  return (
    <HomePage posts={posts} />
  )
}