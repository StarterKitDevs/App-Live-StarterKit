import { useState } from 'react';

const SwapInterface = () => {
  const [sendAmount, setSendAmount] = useState('0.1');
  const [receivedAmount, setReceivedAmount] = useState('10,801.868596');

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto"> {/* Increased max-width for larger screens */}
        <h1 className="text-white text-5xl md:text-6xl lg:text-7xl mb-12 text-center font-bold">Swap Here</h1>
        
        <div className="bg-[#1a2236] rounded-3xl p-6 md:p-8 lg:p-10 w-full shadow-2xl mx-auto max-w-2xl">
          <div className="flex flex-col space-y-6">
            {/* Send Section */}
            <div className="bg-[#1e2943] rounded-xl p-4 lg:p-6">
              <div className="text-gray-400 mb-2 text-lg">You send</div>
              <div className="flex items-center justify-between">
                <input 
                  type="text" 
                  className="bg-transparent text-white text-2xl lg:text-3xl w-1/2 focus:outline-none"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                <div className="flex items-center bg-[#2a3655] rounded-lg px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center mr-2">
                    <span className="text-white text-lg">₿</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">BTC</span>
                    <span className="text-[10px] text-gray-400 uppercase">BTC</span>
                  </div>
                  <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Rate */}
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center text-gray-400 space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8" />
                </svg>
                <span>Floating rate</span>
              </div>
              <button className="text-blue-400 p-2 hover:bg-[#2a3655] rounded-full transition-colors">
                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* Receive Section */}
            <div className="bg-[#1e2943] rounded-xl p-4 lg:p-6">
              <div className="text-gray-400 mb-2 text-lg">You get</div>
              <div className="flex items-center justify-between">
                <div className="text-white text-2xl lg:text-3xl">≈ {receivedAmount}</div>
                <div className="flex items-center bg-[#2a3655] rounded-lg px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#2775CA] flex items-center justify-center mr-2">
                    <span className="text-white text-lg">$</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">USDC</span>
                    <span className="text-[10px] text-gray-400 uppercase">BASE</span>
                  </div>
                  <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-sm text-center text-gray-400">
              By clicking Exchange you agree with{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
            </div>

            {/* Exchange Button */}
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 text-lg font-medium transition-colors duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]">
              Exchange
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapInterface;