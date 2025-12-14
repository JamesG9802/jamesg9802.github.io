import { get_all_posts_static } from "lib/blog-store/data";
import { Post } from "@jamesg9802/blog-store/dist/lib/post";
import MiniSearch from "minisearch";
import { NavBarClient } from "./client";

export async function Navbar() {
  const posts: Post[] = await get_all_posts_static();
  const index: MiniSearch = new MiniSearch({
    idField: "slug",
    fields: ["title", "summary", "date", "tags"],
    storeFields: ["slug", "title", "summary", "date", "tags", "reading_duration"],
    searchOptions: {
      boost: {
        title: 5,
        tags: 3,
        date: 2,
        summary: 1,
      },
      fuzzy: 0.1,
      prefix: true
    }
  });
  index.addAll(posts);

  return (
    <NavBarClient posts={posts} search_index_unparsed={JSON.stringify(index)} />
  )
}