import AppFooter from "components/AppFooter";
import AppHeader from "components/AppHeader";
import { LinkText } from "components/Generic/Link";
import PageTemplate from "pages/PageTemplate";
import { Post } from "pages/Post";
import { useEffect, useState } from "react";

export default function Archive(): JSX.Element {
  const [posts, set_posts] = useState<Post[]>([]);

  //  Loads the markdown.
  useEffect(() => {
    //  Loads the markdown.
    async function init() {
      const post_loaders = await import.meta.glob("/src/posts/*.md", { query: "?raw" });

      //  There aren't a lot of posts, so for now just load every single one.
      for (const path in post_loaders) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const raw_post: string = ((await post_loaders[path]()) as any).default as string;

        //  Parse the post content;
        //  Posts are in the following format:
        //  [Title]
        //  [MM/DD/YYYY]
        //  [Content]
        const lines: string[] = raw_post.split("\n");

        const [month, day, year] = lines[1].split("/")
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        const headers: string[] = [];

        //  Find the headers
        for (let i = 2; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.match(/^#{1,6}/)) {
            headers.push(line);
          }
        }

        //  If there are any relative links in the markdown, replace it with the actual link
        const origin = window.location.origin;
        const page = window.location.hash.split("#")[1];

        for (let i = 2; i < lines.length; i++) {
          const line = lines[i].trim();
          const match = line.match(/\[.*\]\((#.*)\)/);
          if (match != undefined && match[1] != undefined) {
            const id = match[1];
            if (match && id != undefined) {
              lines[i] = lines[i].replace(id, `${origin}#${page}${id}`);
            }
          }
        }

        const post = {
          title: lines[0],
          date: date,
          headers: headers,
          content: lines.slice(2).join("\n")
        };
        set_posts([...posts, post]);
      }
    }

    init();
  }, []);

  return (
    <PageTemplate className="bg-background text-onbackground ">
      <div className="min-h-screen flex flex-col mx-auto max-w-screen-md">
        <AppHeader />
        <div className="flex flex-1">
          <div className="p-8">
            {
              posts.map((element, index) => {
                return (
                  <LinkText className="list-disc list-item" key={index} to={`/blog/${index}`}>
                    {element.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} — {element.title}
                  </LinkText>
                );
              })
            }
          </div>
        </div>
        <AppFooter />
      </div>
    </PageTemplate>
  );
}