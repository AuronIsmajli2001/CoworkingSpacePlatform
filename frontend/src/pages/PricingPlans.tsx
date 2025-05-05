import React from "react";
import Header from "../components/Header";
import { Check, Zap, Star, Coffee, User, Clock, Calendar, Printer, Wifi, 
  Lock, Facebook, Instagram, Twitter, Linkedin, Youtube, Wallet, CreditCard,
   Phone, Mail, MapPin } from 'lucide-react';

const PricingPlans = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full mb-4">
            PRICING PLANS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Plans that fit <span className="text-blue-600">your needs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            In addition to our main plans, we offer virtual addresses, hot desks, and customizable options.
          </p>
        </div>
      </section>

{/* Pricing Cards */}
<section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Daily Plan */}
            <div className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Daily Plan</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">€20</span>
                <span className="text-gray-500">/day</span>
                <p className="text-sm text-gray-500 mt-1">Including VAT</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Designated desk & chair",
                  "High-speed WiFi",
                  "Meeting room access",
                  "Printing & scanner access",
                  "Kitchen access",
                  "Coffee, tea & water"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Additional Services:</h4>
                <p className="text-gray-600 text-sm">Printing & scanner access, parking, private locker, etc.</p>
              </div>
              <button className="w-full py-3 px-6 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition">
                Contact Us
              </button>
            </div>
            {/* Desk Plans */}
            <div className="border-2 border-blue-500 rounded-2xl p-6 transform hover:-translate-y-2 transition-all shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR CHOICE
              </div>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Desk Plans</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">€99-129</span>
                <span className="text-gray-500">/month</span>
                <p className="text-sm text-gray-500 mt-1">Without VAT</p>
              </div>
              <h4 className="font-medium text-gray-900 mb-3">Get it all with our package:</h4>
              <ul className="space-y-3 mb-6">
                {[
                  "24/7 space access",
                  "Desk & ergonomic chair",
                  "High-speed WiFi",
                  "Meeting room use",
                  "Printing & scanning",
                  "Kitchen perks",
                  "Coffee bar access",
                  "Easy-to-use booking app"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
            {/* Hosting Events Plans */}
            <div className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Hosting Events</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">€149</span>
                <span className="text-gray-500">/day</span>
                <p className="text-sm text-gray-500 mt-1">Without VAT</p>
              </div>
              <h4 className="font-medium text-gray-900 mb-3">Presentation Equipment:</h4>
              <ul className="space-y-3 mb-6">
                {[
                  "Wi-Fi",
                  "HD Projector & Screen",
                  "Chairs & tables",
                  "Sound system"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Additional services:</h4>
                <p className="text-gray-600 text-sm">Parking, in-house catering, professional photos, office supplies</p>
              </div>
              <button className="w-full py-3 px-6 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition">
                Contact Us
              </button>
            </div>
            {/* Private Office */}
            <div className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Private Office</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">€350</span>
                <span className="text-gray-500">/month</span>
                <p className="text-sm text-gray-500 mt-1">Without VAT</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Team of 2-3 people",
                  "Designated private office",
                  "24/7 space access",
                  "Desks & ergonomic chairs",
                  "High-speed WiFi",
                  "Printing & scanning",
                  "Kitchen perks",
                  "Coffee bar access"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
<footer className="bg-gray-900 text-white">
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
        <p className="text-white text-[16px] mb-6">
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
              <Icon className="w-5 h-5 text-white" />
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
        { icon: MapPin,  text: "10 B St, Prishtinë, 10000" },
        { icon: Mail,    text: "info@cospace.com"          },
        { icon: Phone,   text: "+383 48 739 738"           }
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
                    items-center justify-between gap-4 px-6 py-6 container mx-auto">
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

export default PricingPlans;