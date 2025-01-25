import AppFooter from "components/AppFooter";
import { Text } from "components/Generic/Text";
import PageTemplate from "pages/PageTemplate";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./index.css";
import rehypeRaw from "rehype-raw";
import { LinkText } from "components/Generic/Link";
import AppHeader from "components/AppHeader";

export type Post = {
  /**
   * The title of the post.
   */
  title: string,

  /**
   * The published date of the post
   */
  date: Date

  /**
   * A list of all the headers to form the table of contents.
   * The type of header is stored " # [TITLE]" would be stored as "# [TITLE]".
   * Although headers can be nested, the structure is not preserved.
   */
  headers: string[]

  /**
   * The actual markdown to be rendered as HTML.
   */
  content: string
};

export default function Post() {
  const { index } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();

  const posts = useRef<Post[]>([]);
  const [current_post, set_current_post] = useState<Post>();

  const left_flex_ref = useRef<HTMLDivElement>(null);
  const side_bar_ref = useRef<HTMLDivElement>(null);

  const [current_header, set_current_header] = useState<string>("");

  //  Updates the width;
  useEffect(() => {
    const cached_left_flex_ref = left_flex_ref.current;
    const resize_observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const padding_left = Number((getComputedStyle(side_bar_ref.current!).paddingLeft).split("px")[0]);
      const padding_right = Number((getComputedStyle(side_bar_ref.current!).paddingRight).split("px")[0]);
      const width = entry.contentRect.width - padding_left - padding_right;

      const padding_top = Number((getComputedStyle(side_bar_ref.current!).paddingTop).split("px")[0]);
      const padding_bottom = Number((getComputedStyle(side_bar_ref.current!).paddingBottom).split("px")[0]);
      const height = entry.contentRect.height - padding_top - padding_bottom;

      side_bar_ref.current!.style.width = width + "px";
      side_bar_ref.current!.style.height = height + "px";
    })

    if (left_flex_ref.current) {
      resize_observer.observe(left_flex_ref.current);
    }

    return () => {
      if (cached_left_flex_ref) {
        resize_observer.unobserve(cached_left_flex_ref);
      }
    }
  }, [left_flex_ref, side_bar_ref])

  //  Updates the table of contents highlight.
  useEffect(() => {
    // Select all headers (h1, h2, h3, etc.) dynamically
    const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const headerId = entry.target.id;
          if (entry.isIntersecting) {
            set_current_header(headerId);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    headers.forEach((header) => {
      if (header.id) observer.observe(header);
    });

    return () => {
      headers.forEach((header) => {
        if (header.id) observer.unobserve(header);
      });
    };
  }, [current_header, current_post]);

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
              lines[i] = lines[i].replace(id, `${origin}#${page}${encodeURI(id)}`);
            }
          }
        }

        const post = {
          title: lines[0],
          date: date,
          headers: headers,
          content: lines.slice(2).join("\n")
        };
        posts.current.push(post);
      }

      if (index != undefined && Number(index) >= 0 && Number(index) < posts.current.length) {
        set_current_post(posts.current[Number(index)]);

        //  scroll to the linked header
        const element = document.getElementById(decodeURI(window.location.hash.split("#")[2]));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100)
        }
      }
      //  If the index is wrong, navigate to the error page
      else {
        navigate("/error");
      }
    }

    init();
  }, [index, navigate]);

  //  Scroll when the user clicks on a link.
  useEffect(() => {
    setTimeout(() => {
      document.getElementById(decodeURI(window.location.hash.split("#")[2]))?.scrollIntoView();
    }, 100)
  }, [hash]);

  return (
    <PageTemplate className="bg-background text-onbackground justify-center">
      <AppHeader />
      <div className="flex flex-row">
        {/* Table of Contents */}
        <div ref={left_flex_ref} className="relative hidden flex-1 md:flex">
          <div ref={side_bar_ref} className="fixed top-16 max-w-96 overflow-clip">
            <div className="p-4">
              <Text type="h4" className="font-bold border-0 border-b border-solid border-outline">Table of Contents</Text>
              {
                current_post?.headers.map((element, index) => {
                  const header_num = element.lastIndexOf("#") + 1;
                  const text: string = element.replace(/^#{1,6}\s/, "");
                  return (
                    <Text
                      style={{ paddingLeft: `${header_num * .75}rem` }}
                      className="whitespace-pre text-xs select-none overflow-clip leading-none m-1"
                      key={index}
                    >
                      <LinkText
                        className={`list-disc list-item ml-1
                        hover:bg-primary/20 active:bg-primary/50 transition-colors p-1
                        ${text == current_header ? "bg-primary/10" : ""}
                        `}
                        to={"#" + text}>
                        {text}
                      </LinkText>
                    </Text>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className="mt-8 bg-surfacecontainer text-onsurface shadow-shadow/50 shadow-md 
          rounded-md mx-auto max-w-screen-sm xl:max-w-screen-md min-h-screen px-4">
          <div className="flex flex-col">
            <div className="flex-1">
              {
                current_post &&
                <div>
                  {/* Title */}
                  <Text className="pb-4 border-solid border-0 border-b-2 border-outline" type="h1">
                    {current_post.title}
                  </Text>
                  {/* Date and Author */}
                  <div>
                    <Text>
                      {
                        current_post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " • " +
                        "James Gaiser"
                      }
                    </Text>
                  </div>
                  {/* Markdown post content */}
                  <Markdown
                    className="post-markdown"
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1(props) { return <Text type="h1" id={props.children?.toString()} linkable className={props.className}>{props.children}</Text> },
                      h2(props) { return <Text type="h2" id={props.children?.toString()} linkable className={props.className}>{props.children}</Text> },
                      h3(props) { return <Text type="h3" id={props.children?.toString()} linkable className={props.className}>{props.children}</Text> },
                      h4(props) { return <Text type="h4" id={props.children?.toString()} linkable className={props.className}>{props.children}</Text> },
                      h5(props) { return <Text type="h5" id={props.children?.toString()} linkable className={props.className}>{props.children}</Text> },
                      blockquote(props) { 
                        return <div className="mx-4 px-4 border-solid border-0 border-l-2 border-outline text-onsurfacevariant">
                          {props.children}
                          </div>
                      }
                    }}
                  >
                    {current_post && current_post.content}
                  </Markdown>
                </div>
              }
            </div>
            <AppFooter />
          </div>
        </div>
        {/* Makes sure the centered div takes up the correct amount of space. */}
        <div className="hidden flex-1 lg:flex"></div>
      </div>
    </PageTemplate>
  );
}