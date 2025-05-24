import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Wifi,
  MapPin,
  Coffee,
  Baby,
  DollarSign,
  Utensils,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  // Function to scroll to the Address & Directions section
  const scrollToBookTour = () => {
    const element = document.getElementById("address-section");
    if (element) {
      const yOffset = -80; // Adjust this value as needed for header spacing
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
  window.scrollTo(0, 0); // Forces scroll to top on page load
}, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative py-40 min-h-[800px] flex items-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Images/office_pic.jpg"
            alt="CoSpace Workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-center mt-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            <span className="block mb-4">CHANGING THE WAY WORK</span>
            <span className="block">
              HAPPENS IN <span className="text-blue-500">PRISHTINA</span>
            </span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white drop-shadow-md">
            Join the CoSpace movement and experience the game-changing way work
            happens in Prishtina.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-gray-900 px-8 py-3 rounded-xl 
                          font-medium hover:bg-gray-100 hover:text-blue-600 
                          transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              CONTACT US
            </button>
            <button
              onClick={scrollToBookTour}
              className="
                      border-2 border-white text-white px-8 py-3 rounded-xl font-medium
                      transition-all duration-300 shadow-lg
                      hover:border-blue-500 
                      hover:bg-white/10 hover:shadow-blue-500/30
                      active:scale-95
                    "
            >
              BOOK A TOUR
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white ">
        <div
          className="container mx-auto px-8 max-w-7xl border border-gray-200 rounded-xl 
               shadow-[0_0_10px_5px_rgba(59,200,246,0.2)]"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center p-8">
            {/* Left Column - Content */}
            <div className="lg:w-1/2 text-center">
              <span className="text-sm font-bold text-blue-600 tracking-wider">
                ABOUT
              </span>
              <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-800">
                CoSpace
              </h2>
              <h3 className="text-[20px] font-bold mb-6 text-blue-600">
                Work for Yourself, not by Yourself!
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A space to build connections and be productive. Meet with your
                clients in a space that is more professional and welcoming than
                a coffee shop. A space that cares about your whole self, not
                just your work self.
              </p>
              <button
                onClick={() => navigate("/about")}
                className="bg-blue-600 text-white font-medium border-gray-700 px-7 py-2 rounded-xl 
                  transition-all duration-300 
                  hover:bg-white hover:text-black 
                  hover:shadow-md hover:shadow-blue-500/30"
              >
                Learn More
              </button>
            </div>

            {/* Right Column - Amenities Cards */}
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <Wifi className="w-6 h-6 text-blue-600" />,
                    text: "High-Speed Internet",
                    border: "border-blue-200",
                  },
                  {
                    icon: <MapPin className="w-6 h-6 text-blue-600" />,
                    text: "Convenient Location",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                  },
                  {
                    icon: <Coffee className="w-6 h-6 text-blue-600" />,
                    text: "CoSpace Coffee Bar",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                  },
                  {
                    icon: <Baby className="w-6 h-6 text-blue-600" />,
                    text: "CoSpace Kids Area",
                    border: "border-blue-200",
                  },
                  {
                    icon: <DollarSign className="w-6 h-6 text-blue-600" />,
                    text: "Affordable Price",
                    border: "border-blue-200",
                  },
                  {
                    icon: <Utensils className="w-6 h-6 text-blue-600" />,
                    text: "Equipped Kitchen",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                  },
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
                      <span className="font-medium text-gray-800">
                        {item.text}
                      </span>
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
          <h2 className="text-[20px] font-bold mt-2 mb-3 text-blue-600">
            Space Facilities & Amenities
          </h2>
          <h3 className="text-5xl font-bold text-black-600 mb-6">
            Flexible Workplace
          </h3>

          <p className="text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed text-lg">
            We offer premium facilities including meeting rooms, conference
            spaces, kitchen areas, kids' corner, rest areas, coffee bar, and
            outdoor veranda.
          </p>

          <button
            onClick={() => navigate("/space")}
            className="bg-blue-600 text-white font-medium px-7 py-3 rounded-xl
                                border-2 border-transparent
                                transition-all duration-300
                                hover:bg-white hover:text-blue-600 hover:border-blue-600 hover:shadow-lg"
          >
            Explore more
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16 max-w-7xl mx-auto">
            {[
              {
                name: "Conference Room 1",
                location: "CoSpace 1",
                image: "/Images/Conference_1.jpg",
              },
              {
                name: "Conference Room 2",
                location: "CoSpace 2",
                image: "/Images/Conference_2.jpg",
              },
              {
                name: "Executive Suite",
                location: "CoSpace 1",
                image: "/Images/meeting-rooms-2.jpg",
              },
            ].map((room, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group relative"
              >
                {/* Image */}
                <div className="relative pb-[70%] overflow-hidden">
                  <img
                    src={room.image}
                    alt={`${room.name} ${room.location}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 text-left">
                  <h4 className="text-2xl font-semibold text-gray-800 mb-1">
                    {room.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">{room.location}</p>
                  <div className="flex justify-between items-center"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address & Directions Section */}
      <section id="address-section" className="relative py-24">
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
            <h2 className="text-[20px] font-semibold text-white mb-4">
              Address & Directions
            </h2>
            <h3 className="text-5xl font-bold text-white mb-6">CoSpace </h3>

            {/* Description */}
            <p className="text-lg font-semibold text-white mb-8 leading-relaxed">
              Feel free to drop by and enjoy a complimentary coffee before
              deciding on a membership.
            </p>

            {/* List Items */}
            <div className="flex flex-col gap-4">
             <button 
                onClick={() => window.open('https://wa.me/38349123456?text=I%20want%20to%20book%20a%20tour')}
                className="flex items-center gap-3 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-3 rounded-xl transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-blue-600" />
                <span>Book a tour via WhatsApp</span>
              </button>

              <button 
              onClick={() => window.open('https://www.google.com/maps?q=ZenVen+1+Str.+Enver+Maloku,+No.10,+Prishtinë,+Kosovo&hl=en&z=16&output=embed')} 
              className="flex items-center gap-3 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-3 rounded-xl transition-all duration-300 group"
            >
              <MapPin className="w-5 h-5 group-hover:text-blue-600" />
              <div className="text-left">
                <span>Location #1</span>
                <p className="text-xs text-white/80 group-hover:text-blue-600/80">Str. Enver Maloku, Prishtinë</p>
              </div>
            </button>

              <button 
                onClick={() => window.open('https://www.google.com/maps?q=CoSpace+2+Str.+Ganimete+Tërbeshi,+No.26,+Prishtinë,+Kosovo&hl=en&z=16&output=embed')} 
                className="flex items-center gap-3 w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 px-5 py-3 rounded-xl transition-all duration-300 group"
              >
                <MapPin className="w-5 h-5 group-hover:text-blue-600" />
                <div className="text-left">
                  <span>Location #2</span>
                  <p className="text-xs text-white/80 group-hover:text-blue-600/80">
                    Str. Ganimete Tërbeshi, Prishtinë
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            What Our Members Say
          </h2>

          <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                name: "Arbesa Gashi",
                img: "/Images/u1.jpg",
                quote:
                  "CoSpace has been a game changer for my freelance journey. The vibe, the people, the space – 10/10.",
                rating: 5,
              },
              {
                name: "Drilon Sevdiu",
                img: "/Images/u2.avif",
                quote:
                  "I found my focus and community here. I never thought coworking could feel this empowering.",
                rating: 5,
              },
              {
                name: "Marigona Krasniqi",
                img: "/Images/u4.webp",
                quote:
                  "Everything just works. The coffee, the Wi-Fi, the support. CoSpace delivers real value every day.",
                rating: 4,
              },
            ].map((person, i) => (
              <div
                key={i}
                className="rounded-3xl shadow-lg overflow-hidden bg-white flex flex-col items-center text-left"
              >
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-full h-72 object-cover"
                />
                <div className="p-6 w-full flex flex-col justify-between h-full">
                  <p className="text-gray-700 text-base mb-6 leading-relaxed">
                    "{" "}
                    <span className="text-gray-700 text-base mb-6 leading-relaxed">
                      {person.quote}
                    </span>{" "}
                    "
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {person.name}
                      </h4>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: person.rating }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <button className="bg-gray-100 text-sm font-semibold px-4 py-2 rounded-full">
                      Member
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;