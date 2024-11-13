import { useState } from "react";

const Hero = () => {
  const [ActiveVid, setActiveVid] = useState(true);
  return (
    <section className="w-full bg-black text-white md:py-16 py-8 lg:pt-12 md:pt-32 pt-28 ">
      <h1 className="md:text-6xl sm:text-4xl text-2xl  font-bold text-center">StarterKit Ecosystem</h1>
      <p className="md:text-2xl sm:text-xl px-4 font-medium text-center text-gray-400">
        Education On-Demand | 24/7 Community
      </p>
      <div className="grid grid-cols-3 md:max-w-[600px] max-w-[400px] gap-2  mx-auto md:mt-10 sm:mt-5 mt-3 px-2">
        <a
          className="md:text-lg text-sm rounded-md flex items-center justify-center bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold"
          href="https://app.getstarterkit.com/"
        >
          App
        </a>
        <a
          className="md:text-lg text-sm truncate sm:flex sm:items-center sm:justify-center rounded-md p-2 bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold"
          href="https://x.getstarterkit.com/market.html"
        >
          Current Market
        </a>
        <a
          className="md:text-lg text-sm rounded-md flex items-center justify-center bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold"
          href="https://store.getstarterkit.com/"
        >
          Store
        </a>
      </div>

      <div className="w-fit mx-auto mt-10 flex items-center justify-center">
        <button
          onClick={() => setActiveVid(() => (ActiveVid ? false : true))}
          className={`py-4 px-4 border-b-2 transition-all duration-300 md:text-2xl sm:text-xl ${
            ActiveVid
              ? "border-b-white text-white"
              : "border-b-gray-400 text-gray-400"
          }`}
        >
          Welcome
        </button>
        <button
          onClick={() => setActiveVid(() => (ActiveVid ? false : true))}
          className={`py-4 px-4 border-b-2 transition-all duration-300 md:text-2xl sm:text-xl ${
            ActiveVid
              ? "border-b-gray-400 text-gray-400"
              : "border-b-white text-white"
          } ml-2`}
        >
          Ecosystem
        </button>
      </div>
     <div className="lg:w-[1000px] mx-auto">
     <div
        className="w-full pt-[56.17021276595745%] relative"
      >
      {ActiveVid ?
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/uD94xn1Roa0?si=PP61DWqAgh97oflO"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        :
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/Pt0k6Zbg-Gw?si=UDjO1_E5_bbSBNJT"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      }
        
      </div>
     </div>
      <p className="container mx-auto mt-8 font-semibold px-2">
      Starter Kit is an online curriculum designed to empower you with tangible skillsets and knowledge in areas like Web3, crypto, blockchain, and technical analysis. It focuses on providing tools and resources for individuals at any level of their journey, helping them start or grow their projects in the blockchain space. The community offers DIY resources for trading, DeFi, content creation, and more.
      </p>
    </section>
  );
};

export default Hero;
