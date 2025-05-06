import React from "react";
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

    </>
  );

};

export default Contact;
