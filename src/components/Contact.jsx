import { HiArrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
  <section className="bg-black">
      <Link to="/videos">
        <div className="w-full h-16 bg-[#FFA500] hover:bg-orange-400 transition-all duration-300 rounded-md flex items-center justify-center font-semibold text-gray-900">
          ON DEMAND{" "}
          <span className="ml-2">
            <HiArrowRight />
          </span>
        </div>
      </Link>
      <div className="container mx-auto bg-black h-full p-10">
        <h1 className="text-white md:text-6xl text-3xl font-bold">Connect with us</h1>
        <div className="flex items-center justify-between md:mt-10 mt-5">
          <h1 className="text-white md:text-3xl text-lg">
          Join us on discord to access our private community.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Contact;
