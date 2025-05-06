import React from "react";
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Header from "../components/Header";
const Contact = () => {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="relative py-32 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full mb-4">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Let's <span className="text-blue-600">connect</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Reach out—we're here to help you find your perfect workspace.
          </p>
        </div>
      </section>


       {/* Contact Cards */}
       <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mail className="w-8 h-8 text-blue-600" />,
                title: "Email Us",
                details: "info@cospace.com",
                subtitle: "Typically replies within 24 hours"
              },
              {
                icon: <Phone className="w-8 h-8 text-blue-600" />,
                title: "Call Us",
                details: "+383 48 739 738",
                subtitle: "Mon-Fri, 9AM-5PM"
              },
              {
                icon: <MapPin className="w-8 h-8 text-blue-600" />,
                title: "Visit Us",
                details: "10 B St, Prishtinë, 10000",
                subtitle: "Book a tour before visiting"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{item.details}</p>
                <p className="text-gray-500 text-sm">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



              {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

    </>
  );

};

export default Contact;
