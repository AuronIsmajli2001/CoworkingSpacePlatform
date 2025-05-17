import {Phone, Mail, MapPin, Send, Calendar, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { useState } from "react";

const Contact = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
    } else {
      setIsLoading(false); // Only show content when authenticated
    }
  }, [navigate]);

  if (isLoading) {
    return null; // Or return a loading spinner
  }

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
            Have questions? Reach out—we're here to help you find your perfect
            workspace.
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
                subtitle: "Typically replies within 24 hours",
              },
              {
                icon: <Phone className="w-8 h-8 text-blue-600" />,
                title: "Call Us",
                details: "+383 48 739 738",
                subtitle: "Mon-Fri, 9AM-5PM",
              },
              {
                icon: <MapPin className="w-8 h-8 text-blue-600" />,
                title: "Visit Us",
                details: "10 B St, Prishtinë, 10000",
                subtitle: "Book a tour before visiting",
              },
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
            <h2 className="text-3xl font-bold mb-6 text-center">
              Send us a message
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

      {/* Visit Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Visit our space</h2>
              <p className="text-gray-600 mb-8">
                Come see CoSpace in person! We'd love to show you around and
                discuss how our workspace can fit your needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span>Mon-Fri: 9AM-5PM</span>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span>Weekends: By appointment</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.356926781522!2d21.15271231546689!3d42.65041587916874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549f3a6d6e2c3f%3A0x1c9c3a9d1a6e1b0d!2sPrishtina!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">
            Ready to see it in person?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book a tour and experience CoSpace firsthand.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
            Book a Tour
          </button>
        </div>
      </section>

      <Footer/>
    </>
  );
};

export default Contact;
