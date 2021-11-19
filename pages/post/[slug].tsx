import { Articles, IStrapi } from "@/interfaces/interfaces";
import { fetchAPI } from "@/lib/api";
import Head from "next/head";
import { getStrapiMedia } from "@/lib/media";
import PostWrapper from "@/components/blog/post/post";
import { Wrapper100 } from "@/constants/basic.styles";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/footer/footer";

interface IParams {
  params: {
    slug: string;
  };
}

const Post: React.FC<IStrapi> = ({ articles, categories }) => {
  const imageUrl = getStrapiMedia(articles.image);
  console.log(articles);
  const seo = {
    metaTitle: articles.title,
    metaDescription: articles.description,
    shareImage: articles.image,
    article: true,
  };

  return (
    <Wrapper100>
      <Navigation />
      <Head>
        <title>{articles.title} | TOUX.io</title>
        <meta name="description" content={articles.content} />
      </Head>
      <PostWrapper
        title={articles.title}
        content={articles.content}
        author={articles.author}
        publishdate={articles.published_at}
        category={articles.category}
      />
      <Footer />
    </Wrapper100>
  );
};

export default Post;

export async function getStaticPaths() {
  const articles = await fetchAPI("/articles");
  return {
    paths: articles.map((article: Articles) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: IParams) {
  const articles = await fetchAPI(`/articles?slug=${params.slug}`);
  const categories = await fetchAPI("/categories");

  return {
    props: { articles: articles[0], categories },
    revalidate: 1,
  };
}
