"use client"

import { Post } from "@jamesg9802/blog-store/dist/lib/post";
import { ArticleList } from "components/ArticleList";
import CenterColumnLayout from "components/layouts/CenterColumnLayout"

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
      <p className="pb-2">
        This is a collection of <span className="line-through">horrifying</span>, err, innovative ideas. Whenever something strikes my fancy, I'll write about it and share my findings here.
      </p>
      <ArticleList article_data={posts} />
    </CenterColumnLayout>
  )
}