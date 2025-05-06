import React from "react";
import { Phone, Mail, MapPin } from 'lucide-react';
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

    </>
  );

};

export default Contact;
