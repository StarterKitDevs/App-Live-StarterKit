import { HiArrowRight } from "react-icons/hi";

const Contact = () => {
  return (
    <section className="bg-[#070c29]">
      <a href="https://discord.com/invite/ubaMrbUZxQ">
        <div className="w-full h-16 bg-[#0075fe] rounded-md flex items-center justify-center font-semibold text-white">
          Discord{" "}
          <span className="ml-2">
            <HiArrowRight />
          </span>
        </div>
      </a>
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
