import Footer from "./Components/footer";
import Hero from "./Components/hero";
import { NavBar } from "./Components/nav-bar";
const Home = () => {
  return (
    <div className=" min-h-screen ">
      <NavBar />
      <main className=" px-8 py-4">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
