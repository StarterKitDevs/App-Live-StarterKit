import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, WagmiProvider } from "wagmi";
import { polygon } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { NFT_ABI, NFT_ADDRESS, projectId, token_id } from './helper/index'
import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Contact from "./components/Contact";
import CalendarBooking from "./components/CalendarBooking";
import BottomSearchBar from "./components/BottomSearchBar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Market from './pages/Market';
import Videos from './pages/Videos';
import Members from './pages/Members';
import Swal from 'sweetalert2';

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: projectId,
  chains: [polygon],
});

const queryClient = new QueryClient();

const Balancecheck = () => {
  const {address , status} = useAccount();

  const { data } = useReadContract({
    abi: NFT_ABI,
    address: NFT_ADDRESS,
    functionName: 'balanceOf',
    args:[address , token_id],
    enabled: status === 'connected' && !!address, 
  });


  useEffect(() => {
    (async()=>{
      if (status === 'connected' && address) {
        if(parseInt(data) > 0){
          Swal.fire({ 
            title: "",
            text: `Starter Kit Member Confirmed`,
            icon: 'success',
            confirmButtonText: 'Cool'
          })
        }else{
          const {isConfirmed} = await Swal.fire({
            title: '',
            text: `You do not have a Starter Kit Member Pass!`,
            icon: 'error',
            confirmButtonText: 'Get it here'
          })

          if(isConfirmed) window.location.href = "https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/11856102366659983612749935230057658851725349010695617715943760134076253604792";
        }
    }
    })()
  }, [data, status, address]);

    return <></>
}

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <BrowserRouter>
            <Nav />
            <Routes>
              <Route path="/" element={<>
                <Hero />
                <Contact />
                <CalendarBooking />
                <Balancecheck />
              </>} />
              <Route path="/market" element={<Market />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/members" element={<Members />} />
            </Routes>
            <BottomSearchBar />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
