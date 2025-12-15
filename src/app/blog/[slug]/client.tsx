"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Giscus from '@giscus/react';

import { Post } from "@jamesg9802/blog-store/dist/lib/post";

import "./index.css"
import Link from "components/Link";
import { SOURCE_REPO__ID, SOURCE_REPO__NAME, SOURCE_REPO__OWNER, SOURCE_REPO_CATEGORY__ID } from "lib/config";

export type BlogPostClientProps = {
  post: Post,

  /**
   * The post published before this one.
   */
  previous?: Post,

  /**
   * The post published after this one.
   */
  next?: Post,
}

export default function BlogPostClient({ post, previous, next }: BlogPostClientProps) {
  const prose_ref = useRef<HTMLDivElement>(null);

  const [current_header, set_current_header] = useState<string>("");
  const [headers, set_headers] = useState<{ id: string; text: string; level: number }[]>([]);

  //  Get the headers on page load.
  useEffect(() => {
    if (!prose_ref.current) return;

    const elements = prose_ref.current.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );

    const collected = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: Number(el.tagName[1]),
    }));

    set_headers(collected);
  }, [post]);

  //  Update the table of contents.
  useEffect(() => {
    if (!prose_ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            set_current_header(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    headers.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [current_header, headers]);

  return (
    <div className="flex flex-row">
      {/* Table of Contents */}
      {/* <aside ref={left_flex_ref} className="relative hidden flex-1 shrink-0 md:flex">
        <div ref={side_bar_ref} className="fixed top-16 p-4 max-w-96 overflow-clip">
          <p className="font-bold underline underline-offset-8 mb-1">
            Table of Contents
          </p>
          {
            headers.map((h) => (
              <p
                key={h.id}
                className="leading-none select-none"
                style={{ paddingLeft: `${(h.level) * 0.75}rem` }}
              >
                <a
                  href={`#${h.id}`}
                  className={`list-disc list-item text-xs p-1 transition-colors duration-150 hover:brightness-150 ${h.id === current_header ? "font-bold underline" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(h.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  {h.text}
                </a>
              </p>
            ))
          }
        </div>
      </aside> */}

      {/* Article */}
      <div className="mx-auto w-full max-w-screen-sm xl:max-w-3xl min-h-screen flex flex-col">
        <div className="bg-base-100 shadow-black/50 shadow-md my-8 pb-4 px-4 flex-1 flex flex-col rounded-md">
          <div className="flex-1">
            <h1 className="text-4xl font-bold w-full pt-6 pb-2 border-solid border-0 border-b-2 border-outline">
              {post.title}
            </h1>
            {// Date and Author
            }
            <p className="pt-2">
              {
                post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " • " +
                "James Gaiser"
              }
            </p>
            <article ref={prose_ref} className="post_markdown pt-8 w-full prose max-w-none">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1(props) { return <h1 id={props.children?.toString()} className={props.className}>{props.children}</h1> },
                  h2(props) { return <h2 id={props.children?.toString()} className={props.className}>{props.children}</h2> },
                  h3(props) { return <h3 id={props.children?.toString()} className={props.className}>{props.children}</h3> },
                  h4(props) { return <h4 id={props.children?.toString()} className={props.className}>{props.children}</h4> },
                  h5(props) { return <h5 id={props.children?.toString()} className={props.className}>{props.children}</h5> },
                  blockquote(props) {
                    return <div className="mx-4 px-4 border-solid border-0 border-l-2 border-outline brightness-110 dark:brightness-90">
                      {props.children}
                    </div>
                  }
                }}
              >
                {post.content}
              </Markdown>
            </article>
            <div className="flex justify-between">
              {
                previous ?
                  <div className="tooltip" data-tip={previous.title}>
                    <Link href={`/blog/${previous.slug}`} className="btn btn-sm md:btn-md gap-2 lg:gap-3">
                      <div className="flex flex-col min-w-0 max-w-36 max-h-full items-start gap-0.5 leading-[1,1]">
                        <span className="text-base-content/50 hidden text-xs font-semibold tracking-wide md:block">
                          {previous.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="truncate w-full">
                          {previous.title}
                        </span>
                      </div>
                    </Link>
                  </div> :
                  <div></div>
              }
              {
                next ?
                  <div className="tooltip" data-tip={next.title}>
                    <Link href={`/blog/${next.slug}`} className="btn btn-neutral btn-sm md:btn-md gap-2 lg:gap-3">
                      <div className="flex flex-col min-w-0 max-w-36 max-h-full items-start gap-0.5 leading-[1,1]">
                        <span className="text-base-content/50 hidden text-xs font-semibold tracking-wide md:block">
                          {next.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="truncate w-full">
                          {next.title}
                        </span>
                      </div>
                    </Link> </div> :
                  <div></div>
              }
            </div>
            <div>
              <Giscus
                id="comments"
                repo={`${SOURCE_REPO__OWNER}/${SOURCE_REPO__NAME}`}
                repoId={SOURCE_REPO__ID}
                category="Announcements"
                categoryId={SOURCE_REPO_CATEGORY__ID}
                mapping="pathname"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="preferred_color_scheme"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Makes sure the centered div takes up the correct amount of space. */}
      {/* <div className="hidden flex-[0.5] lg:flex xl:flex-1"></div> */}
    </div>
  );
}