const CalendarBooking = () => {
  return (
    <section className="w-full bg-gradient-to-b from-black to-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="md:text-6xl text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Ready to Level Up?
            </h2>
            <p className="md:text-2xl text-xl text-gray-300 mb-4">
              Book a 1-on-1 consultation with our team
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get personalized guidance on Web3, blockchain development, trading strategies, 
              or project development. Let's discuss your goals and create a roadmap to success.
            </p>
          </div>

          {/* Cal.com Booking */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl mb-12">
            <iframe
              src="https://cal.com/starter-kit-vovxre"
              width="100%"
              height="700px"
              frameBorder="0"
              style={{ borderRadius: '12px' }}
              title="Book a consultation"
            ></iframe>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-orange-500 text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-400 text-sm">Get answers to your questions in real-time</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-orange-500 text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Personalized Plan</h3>
              <p className="text-gray-400 text-sm">Custom strategy tailored to your goals</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-orange-500 text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-400 text-sm">Learn from experienced Web3 professionals</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Available for Starter Kit members and new clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarBooking;
