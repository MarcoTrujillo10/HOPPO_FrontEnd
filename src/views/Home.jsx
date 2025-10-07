import "./Home.css";
import Hero from "../components/Hero";
import Featured from "../components/Featured";
import NewArrivals from "../components/NewArrivals";
import Offers from "../components/Offers";
import Categories from "../components/Categories";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <main className="home">
      <Hero />
      <div className="container">
        <Featured />
        <NewArrivals />
        <Offers />
        <Categories />
        <Newsletter />
      </div>
      <Footer />
      
    </main>
  );
};

export default Home;
