import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "charly3pins",
    description:
      "Software engineer and tech lead. Writing about AI, architecture, and the craft of building things that work.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.date,
      link: `/blog/${post.slug}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
