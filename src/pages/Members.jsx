import { useState } from 'react';
import { Link } from 'react-router-dom';

const Members = () => {
  const [activeVid, setActiveVid] = useState(true);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-black text-white md:py-16 py-8 pt-6">
        <h1 className="md:text-6xl sm:text-4xl text-2xl font-bold text-center" style={{color: '#FFA500'}}>StarterKit Members</h1>
        <p className="md:text-2xl sm:text-xl px-4 font-medium text-center text-white">Education On-Demand | 24/7 Community</p>

        <div className="grid grid-cols-3 md:max-w-[600px] max-w-[400px] gap-2 mx-auto md:mt-10 sm:mt-5 mt-3 px-2">
          <a className="md:text-lg text-sm rounded-md flex items-center justify-center bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold" href="https://discord.com/invite/ubaMrbUZxQ" target="_blank" rel="noopener noreferrer">Discord</a>
          <Link className="md:text-lg text-sm truncate sm:flex sm:items-center sm:justify-center rounded-md p-2 bg-green-500 hover:bg-green-600 transition-all duration-300 text-white font-semibold" to="/market">Current Market</Link>
          <a className="md:text-lg text-sm rounded-md flex items-center justify-center bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 text-gray-900 font-semibold" href="https://basedrop.fun/drop" target="_blank" rel="noopener noreferrer">Create</a>
        </div>

        <div className="w-fit mx-auto mt-10 flex items-center justify-center">
          <button onClick={() => setActiveVid(!activeVid)} className={`py-4 px-4 border-b-2 transition-all duration-300 md:text-2xl sm:text-xl ${activeVid ? 'border-b-white text-white' : 'border-b-gray-400 text-gray-400'}`}>
            Welcome
          </button>
          <button onClick={() => setActiveVid(!activeVid)} className={`py-4 px-4 border-b-2 transition-all duration-300 md:text-2xl sm:text-xl ${activeVid ? 'border-b-gray-400 text-gray-400' : 'border-b-white text-white'} ml-2`}>
            Ecosystem
          </button>
        </div>

        <div className="lg:w-[1000px] mx-auto">
          <div className="w-full pt-[56.17021276595745%] relative">
            {activeVid ? (
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/hC_lAf2N_M0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            ) : (
              <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/Pt0k6Zbg-Gw?si=UDjO1_E5_bbSBNJT" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            )}
          </div>
        </div>

        <p className="container mx-auto mt-8 font-semibold px-2">Starter Kit is an online curriculum designed to empower you with tangible skillsets and knowledge in areas like Web3, crypto, blockchain, and technical analysis. It focuses on providing tools and resources for individuals at any level of their journey, helping them start or grow their projects in the blockchain space. The community offers DIY resources for trading, DeFi, content creation, and more.</p>
      </section>

      {/* Membership Section */}
      <section className="w-full bg-black text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <h1 className="md:text-6xl text-4xl font-bold text-center mb-12">
            Get Your Starter Kit
          </h1>

        {/* Membership Cards */}
        <div className="space-y-6">
          {/* Starter Kit Member (FREE) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-700 hover:border-orange-500 transition-all duration-300">
            <h2 className="md:text-4xl text-3xl font-bold mb-4">
              Starter Kit Member (FREE)
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Free Discord Access</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Basic On-Demand Crypto Training</span>
              </li>
            </ul>
          </div>

          {/* Pocket Kit ($10) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-700 hover:border-orange-500 transition-all duration-300">
            <h2 className="md:text-4xl text-3xl font-bold mb-2">
              Pocket Kit ($10)
            </h2>
            <p className="text-gray-400 mb-4 md:text-lg">Includes Starter Access</p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Premium discord access (30 days)</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Access to replays pop ups</span>
              </li>
            </ul>
          </div>

          {/* Premium ($25) */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-700 hover:border-orange-500 transition-all duration-300">
            <h2 className="md:text-4xl text-3xl font-bold mb-2">
              Premium ($25)
            </h2>
            <p className="text-gray-400 mb-4 md:text-lg">Includes Starter Access & Pocket Kit</p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Premium Discord Access</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Access to all replays for current month</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Access to trade channels</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Access to Private Starter Kit Channels</span>
              </li>
            </ul>
          </div>

          {/* Lifetime Membership */}
          <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 rounded-3xl p-8 border-2 border-orange-500 hover:border-yellow-500 transition-all duration-300">
            <h2 className="md:text-4xl text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Lifetime Membership
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg">Includes NFT</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">●</span>
                <span className="md:text-xl text-lg font-bold text-white">ALL ACCESS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="md:text-2xl text-xl text-gray-300 font-medium">
            All digital events are pay what you want for lifetime members
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="md:text-3xl text-2xl font-bold">Ready to Join?</h3>
          <p className="text-gray-400 md:text-lg">
            Choose the membership level that's right for you and start your Web3 journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://discord.gg/starterkitecosystem" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 rounded-lg text-gray-900 font-bold text-lg"
            >
              Join Discord
            </a>
            <a 
              href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/11856102366659983612749935230057658851725349010695617715943760134076253604792" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 rounded-lg text-gray-900 font-bold text-lg"
            >
              Get Lifetime NFT
            </a>
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default Members;
