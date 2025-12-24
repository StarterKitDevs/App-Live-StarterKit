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
    </section>
  );
};

export default Contact;
