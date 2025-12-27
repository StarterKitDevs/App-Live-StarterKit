const CalendarBooking = () => {
  return (
    <section className="w-full bg-gradient-to-b from-black to-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="md:text-5xl text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Ready to Level Up?
            </h2>
            <p className="md:text-xl text-lg text-gray-300 mb-2">
              Book a 1-on-1 consultation with our team
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Get personalized guidance on Web3, blockchain development, trading strategies, 
              or project development. Let's discuss your goals and create a roadmap to success.
            </p>
          </div>

          {/* Cal.com Booking */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700 shadow-2xl mb-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
              <div className="text-orange-500 text-2xl mb-2">⚡</div>
              <h3 className="text-base font-semibold mb-1">Quick Response</h3>
              <p className="text-gray-400 text-xs">Get answers to your questions in real-time</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
              <div className="text-orange-500 text-2xl mb-2">🎯</div>
              <h3 className="text-base font-semibold mb-1">Personalized Plan</h3>
              <p className="text-gray-400 text-xs">Custom strategy tailored to your goals</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
              <div className="text-orange-500 text-2xl mb-2">🚀</div>
              <h3 className="text-base font-semibold mb-1">Expert Guidance</h3>
              <p className="text-gray-400 text-xs">Learn from experienced Web3 professionals</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 text-center text-gray-500 text-xs">
            <p>Available for Starter Kit members and new clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarBooking;
