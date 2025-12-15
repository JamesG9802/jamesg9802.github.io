import fs from "fs";
import { Post } from "@jamesg9802/blog-store/dist/lib/post";
import { get_all_blog_posts } from "@jamesg9802/blog-store/dist/post";
import path from "path";
import { DATA_REPO__NAME, DATA_REPO__OWNER } from "lib/config";


let get_all_posts_static_singleton: Promise<Post[]> | undefined;

/**
 * For static site generation, it is necessary to know all the articles.
 * This returns a singleton promise (there is no need to excessively check the data store).
 */
export async function get_all_posts_static(): Promise<Post[]> {
  if (process.env.USE_DUMMY_POSTS == "true") {
    console.log("\nusing dummy posts\n");

    const filePath = path.join(process.cwd(), "src/lib/mock/posts.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const posts: Post[] = JSON.parse(raw);
    for (let i = 0; i < posts.length; i++) {
      posts[i].date = new Date(posts[i].date);
    }
    return posts;
  }
  if (process.env.USE_CACHE == "true") {
    if (!fs.existsSync("_cache")) {
      fs.mkdirSync("_cache");
    }

    if (!fs.existsSync("_cache/posts.json")) {
      const posts: Post[] = await get_all_blog_posts(DATA_REPO__OWNER, DATA_REPO__NAME);
      console.info("Storing posts in cache.");
      fs.writeFileSync("_cache/posts.json", JSON.stringify(posts));
      return posts;
    }
    else {
      try {
        const posts: Post[] = JSON.parse(fs.readFileSync("_cache/posts.json", { encoding: "utf-8" }));
        for (let i = 0; i < posts.length; i++) {
          posts[i].date = new Date(posts[i].date);
        }
        return posts;
      }
      catch (err: unknown) {
        console.error(err);
        return [];
      }
    }
  }

  if (!get_all_posts_static_singleton) {
    console.info("Fetching all posts.");
    get_all_posts_static_singleton = get_all_blog_posts(DATA_REPO__OWNER, DATA_REPO__NAME)
  }
  return get_all_posts_static_singleton;
}