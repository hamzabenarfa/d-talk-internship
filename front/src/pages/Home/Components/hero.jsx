import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section>
            <div className='bg-gray-800 bg-[url("/public/hero.jpg")] bg-cover bg-center text-white text-center py-80 relative'>
                <div className='absolute inset-0 bg-black bg-opacity-50'></div>
                <div className='relative z-10'>
                    <h1 className='text-4xl font-bold'>TOUJOURS À LA RECHERCHE DE PERSONNES EXCELLENTES</h1>
                    <p className='mt-4 font-semibold  shadow-xl'>Postes Ouverts</p>
                    <Link to="/stage" className='mt-8 inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1'>
                        Chercher un stage
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;
