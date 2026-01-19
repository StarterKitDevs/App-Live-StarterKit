import { HiHome } from "react-icons/hi";
import logo from "../assets/logo.jpg";

const Nav = () => {
  return (
    <nav className="bg-white w-full z-30">
      <div className="mx-auto flex items-center justify-between py-2 px-2 lg:px-4 max-w-screen-xl">
        <a href="/">
          <img className="w-24" src={logo} alt="logo" />
        </a>
        <div className="flex items-center">
          <a className="mx-2 lg:mx-4 hover:opacity-75 transition-all duration-300" href="/members">Members</a>
          <a className="mx-2 lg:mx-4 hover:opacity-75 transition-all duration-300" href="/glossary">Glossary</a>
          <a className="mx-2 lg:mx-4 hover:opacity-75 transition-all duration-300" href="">Docs</a>
          <a className="mx-2 lg:mx-4 hover:opacity-75 transition-all duration-300 py-2 px-6 text-white bg-slate-900" href="https://discord.com/invite/ubaMrbUZxQ">Discord</a>
            {/* Login button removed for homepage placement */}
          <a className="mx-2 lg:mx-4 hover:text-orange-500 transition-all duration-300 flex items-center text-2xl text-gray-800" href="/" title="Home">
            <HiHome />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
