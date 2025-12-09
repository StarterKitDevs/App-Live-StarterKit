import MarketDashboard from '../components/MarketDashboard';

const Market = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="md:py-16 py-8 lg:pt-12 md:pt-32 pt-28 container mx-auto px-4">
        <MarketDashboard />
      </div>
    </div>
  );
};

export default Market;