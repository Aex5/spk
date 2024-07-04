import Layout from "@/components/Layout";
import Banner from "@/components/Banner";
import Promotion from "@/components/Promotion";
import Search from "@/components/Search";
import Trim from "@/components/Trim";
import Card from "@/components/Card";

export default function Home() {
  return (
    <Layout>
      <Banner />
      <Search />
      <Trim />
      <Card/>
      <Promotion />
    </Layout>
  );
}
