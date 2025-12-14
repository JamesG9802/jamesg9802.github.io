"use client"

import { Post } from "@jamesg9802/blog-store/dist/lib/post";
import CenterColumnLayout from "components/layouts/CenterColumnLayout"
import Link from "components/Link"

import { motion } from "framer-motion";

type PostsProps = {
  article_data: Post[]
}

function Posts({ article_data }: PostsProps) {
  return (
    <ul className="list gap-y-2">
      {
        article_data.sort((a, b) => b.date.getTime() - a.date.getTime()).map((article, index) =>

          <Link key={index} href={`/blog/${article.slug}`}>
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
                  <p className="">
                    {article.date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}
                  </p>
                </div>
              </li>
            </motion.div>
          </Link>
        )
      }
    </ul>
  )
}

export type HomePageProps = {
  posts: Post[];
}

export default function HomePage({ posts }: HomePageProps) {

  return (
    <CenterColumnLayout className="bg-base-100 shadow-md min-h-screen">
      <div className="hero pt-10">
        <div className="hero-content">
          <h1 className="text-4xl font-bold text-center">James Gaiser</h1>
        </div>
      </div>
      <div className="divider" />
      <p>
        This is a collection of <span className="line-through">horrifying</span>, err, innovative ideas. Whenever something strikes my fancy, I'll write about it and share my findings here.
      </p>
      <Posts article_data={posts} />
    </CenterColumnLayout>
  )
}