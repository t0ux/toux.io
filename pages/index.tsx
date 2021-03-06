import Head from "next/head";
import Footer from "@/components/footer/footer";
import Hero from "@/components/home/hero/hero";
import Statistics from "@/components/home/statistics/statistics";
import Navigation from "@/components/navigation/navigation";
import { Wrapper100 } from "@/constants/basic.styles";
import { IArticleArr } from "@/interfaces/interfaces";
import { fetchAPI, fetchLastFM } from "@/lib/api";
import MobileNav from "@/components/navigation/mobilenav";
import { useState } from "react";
import MobileMenuIcon from "@/components/navigation/mobileMenuIcon";
import ScrollToTop from "@/components/scroll/scrollToTop";


const Home: React.FC<IArticleArr> = ({ homepage, scrobble, articles }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Head>
        <title>TOUX.io | Developer, blogger, tech enthusiast</title>
        <meta name="description" content="Personal portfolio, Frontend Development, Blogging, Tech & Life" />
      </Head>
      <Wrapper100 className="AppWrapper">
        <ScrollToTop />
        <MobileMenuIcon showMenu={showMenu} setShowMenu={setShowMenu} />
        {showMenu && <MobileNav />}
        <Navigation />
        <Hero info={homepage?.info} />
        <Statistics articles={articles} scrobble={scrobble} />
        <Footer />
      </Wrapper100>
    </>
  );
};

export async function getStaticProps() {
  const [articles, homepage] = await Promise.all([
    fetchAPI('/articles'),
    fetchAPI('/homepage')
  ])

  const scrobble = await fetchLastFM(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=10&user=andreaserhard&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY}&format=json`);

  if (!articles) {
    return {
      notFound: true,
    };
  }

  return {
    props: { articles, homepage, scrobble },
    revalidate: 1,
  };
}

export default Home;
