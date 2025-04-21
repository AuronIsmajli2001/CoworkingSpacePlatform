import React from "react";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <span className="text-sm font-semibold tracking-wider">01 — 04</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            CHANGING THE WAY WORK HAPPENS IN PRISHIINA
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the CoSpace movement and experience the game-changing way work happens in Brishina.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-gray-900 px-8 py-3 rounded font-medium hover:bg-gray-100 transition">
              CONTACT US
            </button>
            <button className="border-2 border-white px-8 py-3 rounded font-medium hover:bg-white hover:text-gray-900 transition">
              BOOK A TOUR
            </button>
          </div>
        </div>
      </section>

    {/* About Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-6 max-w-6xl">
    <div className="flex flex-col lg:flex-row gap-12 items-center">
      {/* Left Column - Content */}
      <div className="lg:w-1/2">
        <span className="text-sm font-semibold text-indigo-600 tracking-wider">ABOUT</span>
        <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-800">CoSpace</h2>
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">Work for Yourself, not by Yourself!</h3>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          A space to build connections and be productive. Meet with your clients in a space that is more professional and welcoming than a coffee shop. A space that cares about your whole self, not just your work self.
        </p>
        <button className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1 hover:text-indigo-800 transition flex items-center group">
          Learn More
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Right Column - Amenities Cards */}
      <div className="lg:w-1/2">
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: '📶', text: 'High-Speed Internet', bg: 'bg-blue-50', border: 'border-blue-100' },
            { icon: '📍', text: 'Convenient Location', bg: 'bg-green-50', border: 'border-green-100' },
            { icon: '☕', text: 'CoSpace Coffee Bar', bg: 'bg-amber-50', border: 'border-amber-100' },
            { icon: '🧸', text: 'CoSpace Kids Area', bg: 'bg-pink-50', border: 'border-pink-100' },
            { icon: '💰', text: 'Affordable Price', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { icon: '🍽️', text: 'Equipped Kitchen', bg: 'bg-orange-50', border: 'border-orange-100' }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${item.border} ${item.bg} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2">{item.icon}</span>
                <span className="font-medium text-gray-800">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mt-2 mb-4">Space Facilities & Amenities</h2>
          <h3 className="text-2xl font-semibold mb-6">Flexible Workplace</h3>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            We offer a range of facilities and amenities to help you work efficiently, including meeting rooms, a conference room, a kitchen area, a kids' corner for working parents, rest areas, a coffee bar for refreshments, and a veranda for outdoor work or breaks.
          </p>
          <button className="border-b-2 border-gray-900 pb-1 font-medium hover:text-gray-600 transition">
            Explore more
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              'Conference Room 1 - ZenVen 1',
              'Conference Room 2 - ZenVen 2',
              'Dedicated Desk 1 - ZenVen 1',
              'Dedicated Desk 2'
            ].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <h4 className="font-bold text-lg">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

     

        {/* Address & Directions Section */}
<section className="relative py-24">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/Images/city.png" 
      alt="CoSpace Space" 
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Content */}
  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-2xl p-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-white mb-4">Address & Directions</h2>
      <h3 className="text-5xl font-bold text-white mb-6">CoSpace </h3>
      
      {/* Description */}
      <p className="text-lg font-semibold text-white mb-8 leading-relaxed">
        Feel free to drop by and enjoy a complimentary coffee before deciding on a membership.
      </p>
      
      {/* List Items */}
      <div className="flex flex-col gap-4">
        <button className="flex items-center gap-2 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-2 rounded-full transition">
          <span className="text-xl">📌</span>
          <span>Book a tour via WhatsApp</span>
        </button>

        <button className="flex items-center gap-2 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-2 rounded-full transition">
          <span className="text-xl">📍</span>
          <span>Location #1</span>
        </button>

        <button className="flex items-center gap-2 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-2 rounded-full transition">
          <span className="text-xl">📎</span>
          <span>Location #2</span>
        </button>
      </div>

    </div>
  </div>
</section>
    </>
  );
};

export default Home;