import Layout from "@/components/Layout";
import Banner from "@/components/Banner";
import Promotion from "@/components/Promotion";
import Card from "@/components/Card";
import Category from "@/components/Category";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <Layout>
      <Banner />
      <Card />
      <Promotion />
      <Navigation />
    </Layout>
  );
}
