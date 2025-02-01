import Header from './Components/header'
import Footer from './Components/footer';
import Hero from './Components/hero';
import Section from './Components/section';
import Stage from './Components/stage';
const Home = () => {
    return (
        <div className=' min-h-screen '>
            <Header />
                <main>
                    <Hero />
                    <Section />
                    {/* <Stage /> */}
                </main>
            <Footer />
        </div>
    );
}

export default Home;