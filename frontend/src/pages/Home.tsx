import React from "react";
import Header from "../components/Header";
import { 
  Wifi, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  CreditCard,
  Wallet,
  Coffee,
  Mail,
  Phone, 
  Baby, 
  DollarSign, 
  Utensils,
  MessageCircle, 
} from 'lucide-react';

const Home = () => {
  return (
    <>
      <Header />
      
     {/* Hero Section */}
<section className="relative py-32 min-h-[650px] flex items-center">
  {/* Background Image with Dark Overlay */}
  <div className="absolute inset-0 z-0">
    <img
      src="/Images/2.png" 
      alt="CoSpace Workspace"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/40"></div>
  </div>

  {/* Content */}
  <div className="container mx-auto px-6 relative z-10 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-7 text-white drop-shadow-lg">
      CHANGING THE WAY WORK HAPPENS IN PRISHTINA
    </h1>
    <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90 drop-shadow-md">
      Join the CoSpace movement and experience the game-changing way work happens in Prishtina.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button className="bg-white text-gray-900 px-8 py-3 rounded-xl 
                          font-medium hover:bg-gray-100 hover:text-blue-600 
                          transition-all duration-300 shadow-lg hover:shadow-xl">
        CONTACT US
      </button>
      <button className="
                      border-2 border-white text-white px-8 py-3 rounded-xl font-medium
                      transition-all duration-300 shadow-lg
                      hover:border-blue-500 
                      hover:bg-white/10 hover:shadow-blue-500/30
                      active:scale-95
                    ">
                      BOOK A TOUR
</button>
    </div>
  </div>
</section>

    {/* About Section */}
        <section className="py-16 bg-white ">
      <div className="container mx-auto px-8 max-w-7xl border border-gray-200 rounded-xl 
               shadow-[0_0_10px_5px_rgba(59,200,246,0.2)]">
        <div className="flex flex-col lg:flex-row gap-12 items-center p-8">
          {/* Left Column - Content */}
          <div className="lg:w-1/2 text-center">
            <span className="text-sm font-bold text-blue-600 tracking-wider">ABOUT</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-800">CoSpace</h2>
            <h3 className="text-[20px] font-bold mb-6 text-blue-600">Work for Yourself, not by Yourself!</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A space to build connections and be productive. Meet with your clients in a space that is more professional and welcoming than a coffee shop. A space that cares about your whole self, not just your work self.
            </p>
            <button className="bg-blue-600 text-white font-medium border-gray-700 px-7 py-2 rounded-xl 
                  transition-all duration-300 
                  hover:bg-white hover:text-black 
                  hover:shadow-md hover:shadow-blue-500/30">
              Learn More
            </button>
          </div>

          {/* Right Column - Amenities Cards */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  icon: <Wifi className="w-6 h-6 text-blue-600" />, 
                  text: 'High-Speed Internet', 
                  border: 'border-blue-200'
                },
                { 
                  icon: <MapPin className="w-6 h-6 text-blue-600" />, 
                  text: 'Convenient Location', 
                  bg: 'bg-blue-50', 
                  border: 'border-blue-200'
                },
                { 
                  icon: <Coffee className="w-6 h-6 text-blue-600" />, 
                  text: 'CoSpace Coffee Bar', 
                  bg: 'bg-blue-50', 
                  border: 'border-blue-200'
                },
                { 
                  icon: <Baby className="w-6 h-6 text-blue-600" />, 
                  text: 'CoSpace Kids Area', 
                  border: 'border-blue-200'
                },
                { 
                  icon: <DollarSign className="w-6 h-6 text-blue-600" />, 
                  text: 'Affordable Price', 
                  border: 'border-blue-200'
                },
                { 
                  icon: <Utensils className="w-6 h-6 text-blue-600" />, 
                  text: 'Equipped Kitchen', 
                  bg: 'bg-blue-50', 
                  border: 'border-blue-200'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`p-5 rounded-xl border ${item.border} ${item.bg}
                            transition-all duration-200 hover:shadow-md
                            hover:border-blue-300 hover:translate-y-[-2px]`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                      {item.icon}
                    </div>
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
      <section className="py-16 bg-white isolate ">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-[20px] font-bold mt-2 mb-3 text-blue-600">Space Facilities & Amenities</h2>
          <h3 className="text-5xl font-bold text-black-600 mb-6">Flexible Workplace</h3>
          
          <p className="text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed text-lg">
            We offer premium facilities including meeting rooms, conference spaces, kitchen areas, kids' corner, rest areas, coffee bar, and outdoor veranda.
          </p>
          
          <button className="bg-blue-600 text-white font-medium px-7 py-3 rounded-xl
                          border-2 border-transparent
                          transition-all duration-300
                          hover:bg-white hover:text-blue-600 hover:border-blue-600 hover:shadow-lg">
                Explore more
              </button>

    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
      {[
        { 
          name: 'Conference Room 1', 
          location: 'CoSpace 1', 
          image: '/Images/Conference_1.jpg',
        },
        { 
          name: 'Conference Room 2', 
          location: 'CoSpace 2', 
          image: '/Images/Conference_2.jpg',
        },
        { 
          name: 'Executive Suite', 
          location: 'CoSpace 1', 
          image: '/Images/meeting-rooms-2.jpg',
        }
        
      ].map((room, index) => (
        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
          <div className="relative pb-[80%] overflow-hidden">
          <img
            src={room.image}
            alt={`${room.name} ${room.location}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
          
          {/* Content */}
          <div className="p-5 text-left">
            <h4 className="font-bold text-lg text-gray-800">{room.name}</h4>
            <p className="text-blue-600 font-medium">{room.location}</p>
            <button className="mt-3 text-blue-600 text-sm font-semibold hover:text-blue-800 transition">
              View details →
            </button>
          </div>
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
      <h2 className="text-[20px] font-semibold text-white mb-4">Address & Directions</h2>
      <h3 className="text-5xl font-bold text-white mb-6">CoSpace </h3>
      
      {/* Description */}
      <p className="text-lg font-semibold text-white mb-8 leading-relaxed">
        Feel free to drop by and enjoy a complimentary coffee before deciding on a membership.
      </p>
      
      {/* List Items */}
      <div className="flex flex-col gap-4">
        <button className="flex items-center gap-3 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-3 rounded-xl transition-all duration-300 group">
          <MessageCircle className="w-5 h-5 group-hover:text-blue-600" />
          <span>Book a tour via WhatsApp</span>
        </button>

        <button className="flex items-center gap-3 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-3 rounded-xl transition-all duration-300 group">
          <MapPin className="w-5 h-5 group-hover:text-blue-600" />
          <div className="text-left">
            <span>Location #1</span>
          </div>
        </button>

        <button className="flex items-center gap-3 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-3 rounded-xl transition-all duration-300 group">
          <MapPin className="w-5 h-5 group-hover:text-blue-600" />
          <div className="text-left">
            <span>Location #2</span>
          </div>
        </button>
      </div>

    </div>
  </div>
</section>

{/* Footer */}
<footer className="bg-neutral-900 text-white">
  {/* top area */}
  <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold tracking-wider">
        Co<span className="text-blue-500">Space</span>
      </h2>
      <p className="max-w-xs text-sm text-neutral-300">
        Work for yourself, not by yourself. Flexible, connected, inspiring.
      </p>
    </div>
    {/* 2️⃣ Socials + payment */}
    <div className="space-y-10">
      {/* socials */}
      <div>
        <h4 className="text-2xl font-semibold mb-4">Our Socials</h4>
        <p className="text-neutral-400 text-sm mb-6">
          A monthly digest of the latest news and resources.
        </p>
        <div className="flex gap-3">
          {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700
                         flex items-center justify-center transition"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      {/* payment */}
      <div>
        <h4 className="text-2xl font-semibold mb-4">Payment Methods</h4>
        <div className="flex gap-3">
          {[CreditCard, Wallet].map((Icon, i) => (
            <span
              key={i}
              className="w-10 h-10 rounded-xl bg-blue-600 flex items-center
                         justify-center"
            >
              <Icon className="w-5 h-5" />
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 3️⃣ Contacts */}
    <div className="space-y-8">
      <h4 className="text-2xl font-semibold">Our Contacts</h4>

      {[
        { icon: MapPin,  text: "10 B St, Prishtinë, 10000" },
        { icon: Mail,    text: "info@cospace.com"          },
        { icon: Phone,   text: "+383 48 739 738"           }
      ].map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  </div>

  {/* bottom bar */}
        <div
          className="border-t border-neutral-700 text-sm flex flex-col md:flex-row
                    items-center justify-between gap-4 px-6 py-6 container mx-auto"
        >
          <span>
            © {new Date().getFullYear()} CoSpace. All rights reserved.
          </span>
          <a href="#" className="hover:text-neutral-400">
            Terms of use
          </a>
        </div>
      </footer>
    </>
  );
};

export default Home;