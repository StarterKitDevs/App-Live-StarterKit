import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../assets/logo.jpg";
import { IoClose, IoMenuSharp } from "react-icons/io5";
import { useState } from "react";

const Nav = () => {
  const [isMenuOpen, setisMenuOpen] = useState(false)
  return (
    <>
      {!!isMenuOpen && <div className="w-full h-full fixed z-20" onClick={()=>setisMenuOpen(false)}></div>}
  <div className={`w-full h-80 bg-white fixed ${isMenuOpen ? "top-24" : "-top-full"} left-1/2 -translate-x-1/2 rounded-xl transition-all duration-1000 z-20 flex items-center justify-center`}>
  <div className="items-center flex flex-col">
      <a className="my-2 hover:opacity-75 transition-all duration-300" href="">Docs</a>
      <a className="my-2 hover:opacity-75 transition-all duration-300 py-2 px-6 text-white bg-slate-900" href="https://discord.com/invite/ubaMrbUZxQ">Discord</a>
    </div>
  </div>
  <nav className={`lg:relative fixed bg-white w-full transition-all ${isMenuOpen ? "z-10 delay-1000" : "z-30"}`}>
      <div className="mx-auto flex items-center justify-between h-20 container px-2 lg:px-4 max-w-screen-xl">
        <a href="/">
          <img className="w-24" src={logo} alt="logo" />
        </a>

        <div className="flex items-center">
    <div className="items-center mr-1 hidden md:flex">
      <a className="mx-2 lg:mx-4 hover:opacity-75 transition-all duration-300" href="">Docs</a>
      <a className="mx-2 lg:mx-4 hover:opacity-75 transition-all duration-300 py-2 px-6 text-white bg-slate-900" href="https://discord.com/invite/ubaMrbUZxQ">Discord</a>
    </div>
          <div className="flex items-center">
          <ConnectButton />
          <button onClick={()=>setisMenuOpen(()=> isMenuOpen ? false : true)} className="text-xl ml-3 sm:ml-4 md:hidden block cursor-pointer border p-2">
          {isMenuOpen ? <IoClose /> : <IoMenuSharp />}
          </button>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Nav;
