import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../assets/logo.jpg";

const Nav = () => {
  return (
    <nav className="relative bg-white w-full z-30">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
