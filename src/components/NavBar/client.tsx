"use client"

import { useDeferredValue, useMemo, useRef, useState } from "react";

import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import { Post } from "@jamesg9802/blog-store/dist/lib/post";
import MiniSearch, { SearchResult } from "minisearch";
import Link from "components/Link";
import { ArticleList } from "components/ArticleList";

/**
 * Obviously, not best practice. 
 * However, unless there are hundreds, thousands, or even tens of thousands of blog posts, this is not going to cause a problem.
 */
export type NavBarCLientProps = {
  posts: Post[],
  search_index_unparsed: string
}

export function NavBarClient({ posts, search_index_unparsed }: NavBarCLientProps) {
  const search_index: MiniSearch = MiniSearch.loadJSON(search_index_unparsed, {
    fields: ["title", "summary", "tags"],
  });

  const modal_ref = useRef<HTMLDialogElement>(null);

  const [query, set_query] = useState<string>("");
  const deferred_query = useDeferredValue(query);

  const search_results: SearchResult[] = useMemo(() => {
    if (!deferred_query) {
      return [];
    }

    const _query = deferred_query.toLowerCase();

    return search_index.search(_query, { prefix: true, fuzzy: 0.2 });

  }, [deferred_query, posts, search_index]);

  return (

    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">Home</Link>
      </div>
      <div className="flex gap-2">
        <button
          className="input input-ghost hover:bg-base-200 focus-visible:bg-base-200 cursor-pointer transition-colors focus:outline-none"
          onClick={() => {
            modal_ref.current?.showModal();
            set_query("");
          }}
        >

          <Icon path={mdiMagnify} size={1} className="opacity-50" />
          <span className="grow text-left">
            Search…
          </span>
          {/* <kbd className="kbd kbd-sm font-mono opacity-50">
            <span className="me-1 text-sm">
              ⌘
            </span>
            K
          </kbd> */}
        </button>
      </div>
      <dialog ref={modal_ref} className="modal">
        <div className="modal-box min-h-[60vh] max-h-[80vh] overflow-y-auto">
          <label className="input input-ghost w-full focus:outline-none">
            <Icon path={mdiMagnify} size={1} className="opacity-50" />
            <input type="text" value={query} onChange={(e) => { set_query(e.currentTarget.value); }} placeholder="Search" />
            <span> {search_results.length} {search_results.length == 1 ? "results" : "results"}</span>
          </label>
          <div className="py-4">
            {
              <ArticleList
                article_data={search_results.map((result) => {
                  const result_as_post: Post = result as unknown as Post;
                  return {
                    title: result_as_post.title,
                    slug: result_as_post.slug,
                    date: new Date(result_as_post.date),
                    summary: result_as_post.summary,
                    tags: result_as_post.tags,
                    reading_duration: result_as_post.reading_duration
                  }
                })}
                onLeave={() => {
                  modal_ref.current?.close();
                }}
              />
            }
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}