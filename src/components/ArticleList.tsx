import { format_seconds } from "lib/utils/format_seconds";
import Link from "./Link"
import { motion } from "framer-motion"

type PostsProps = {
  article_data: {
    /**
     * The name of the post, visible to the user.
     */
    title: string;

    /**
     * The unique URL leading to the post. 
     */
    slug: string;

    /**
     * The date of publication.
     */
    date: Date;

    /**
     * The summary of the post.
     */
    summary: string;

    /**
     * The tags of the post.
     */
    tags: string[];

    /**
     * The number of estimated seconds to read the article.
     */
    reading_duration: number;
  }[],

  /**
   * Optional callback to be invoked when an anchor link is clicked.
   * @returns 
   */
  onLeave?: () => void;
}

export function ArticleList({ article_data, onLeave }: PostsProps) {
  return (
    <ul className="list gap-y-2">
      {
        article_data.sort((a, b) => b.date.getTime() - a.date.getTime()).map((article, index) =>

          <Link key={index} href={`/blog/${article.slug}`} onClick={() => { onLeave && onLeave() }}>
            <motion.div
              transition={{
                duration: 0.4,
                delay: 1,
                scale: {
                  type: "spring",
                  visualDuration: 0.4,
                  bounce: 0.5,
                },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <li className="list list-row flex flex-wrap gap-2 shadow-sm hover:shadow-md hover:bg-primary hover:text-info transition-all duration-150">
                <div className="w-full sm:w-auto">
                  <p className="font-bold">
                    {article.title}
                  </p>
                </div>
                <div className="w-full sm:w-auto flex flex-row gap-2">
                  <span>
                    {article.date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}
                  </span>
                  —
                  <span>
                    {format_seconds(Math.floor(article.reading_duration))}
                  </span>
                </div>
              </li>
            </motion.div>
          </Link>
        )
      }
    </ul>
  )
}