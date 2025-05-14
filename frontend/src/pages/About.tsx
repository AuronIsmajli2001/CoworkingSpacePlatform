import React from "react";
import Header from "../components/Header";
import {
  Sparkles,
  Users,
  Heart,
  Coffee,
  Home,
  MapPin,
  Phone,
  CreditCard,
  Mail,
  Facebook,
  Wallet,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <>
      <Header />

      {/* Minimal Hero */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-4 text-blue-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">ABOUT COSPACE</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            We built <span className="text-blue-600">CoSpace</span> for you
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A space worth leaving home for. Professional yet welcoming. Designed
            for productivity but built for connection.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition duration-300"></div>
              <img
                src="/Images/about-us.png"
                alt="CoSpace interior"
                className="relative rounded-xl w-full h-auto object-cover shadow-lg"
              />
            </div>

            {/* Right Column - Text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-blue-600"></div>
                <span className="text-sm font-medium text-gray-500">
                  OUR STORY
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                In search of the perfect workspace, we created our own
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  CoSpace was born from countless hours in coffee shops and home
                  offices - never quite finding that sweet spot between
                  professional and personal.
                </p>
                <p>
                  We designed a space that celebrates work as part of life, not
                  separate from it. Where productivity meets community, and
                  every detail serves your needs.
                </p>
                <p>
                  This isn't just office space. It's where work feels right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            <span className="text-blue-600">Co</span>mmunity •{" "}
            <span className="text-blue-600">Space</span> •{" "}
            <span className="text-blue-600">Balance</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600 mx-auto" />,
                title: "Together, alone",
                description: "The perfect balance of community and focus",
              },
              {
                icon: <Coffee className="w-8 h-8 text-blue-600 mx-auto" />,
                title: "Third space",
                description: "Not home, not office - something better",
              },
              {
                icon: <Heart className="w-8 h-8 text-blue-600 mx-auto" />,
                title: "Made with care",
                description: "Every detail designed for your comfort",
              },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer*/}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-wider">
              Co<span className="text-blue-500">Space</span>
            </h2>
            <p className="max-w-xs text-sm text-neutral-300">
              Work for yourself, not by yourself. Flexible, connected,
              inspiring.
            </p>
          </div>
          {/* 2️⃣ Socials + payment */}
          <div className="space-y-10">
            {/* socials */}
            <div>
              <h4 className="text-2xl font-semibold mb-4">Our Socials</h4>
              <p className="text-white text-[16px] mb-6">
                A monthly digest of the latest news and resources.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700
                         flex items-center justify-center transition"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </a>
                  )
                )}
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
                    <Icon className="w-5 h-5 text-white" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3️⃣ Contacts */}
          <div className="space-y-8">
            <h4 className="text-2xl font-semibold">Our Contacts</h4>

            {[
              { icon: MapPin, text: "10 B St, Prishtinë, 10000" },
              { icon: Mail, text: "info@cospace.com" },
              { icon: Phone, text: "+383 48 739 738" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
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

export default About;
