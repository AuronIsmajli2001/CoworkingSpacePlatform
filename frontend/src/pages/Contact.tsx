import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Phone, Mail, MapPin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    emailjs.init("NN1Y6SiV6LacxIpev");
  }, []);

  const contactCards = [
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: "Email Us",
      details: "info@cospace.com",
      subtitle: "Replies within 24 hours",
      isEmail: true,
    },
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Call Us",
      details: "+383 48 739 738",
      subtitle: "Mon-Fri, 9AM-5PM",
    },
      {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Our Location",
      details: (
        <div className="text-blue-800 leading-snug">
          <span className="font-semibold">CoSpace:</span><br />
          Str. Enver Maloku, No.10<br />
          Prishtinë, 10000, RKS
        </div>
      ),
      subtitle: "Click to view on map",
      isMap: true,
    }

,
  ];

  const handleClick = (item: typeof contactCards[0]) => {
    if (item.isEmail) {
      window.location.href = `mailto:${item.details}`;
    } else if (item.isMap) {
      document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const form = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
      reset: () => void;
    };

    const templateParams = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    emailjs
      .send("service_gvafdiw", "template_op9u2mb", templateParams)
      .then(() => {
        setStatus("Message sent! We'll contact you shortly.");
        form.reset();
      })
      .catch(() => {
        setStatus("Oops! Something went wrong. Try again.");
      });
  };


  useEffect(() => {
  window.scrollTo(0, 0); // Forces scroll to top on page load
}, []);

  return (
    <>
      <Header />

      <section className="relative py-32 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-white text-blue-600 rounded-full mb-4">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Let's <span className="text-blue-600">connect</span>
          </h1>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto">
            Have questions? Reach out—we're here to help you find your perfect workspace.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center gap-16 relative">
          <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full border-l-2 border-blue-300"></div>

          <div className="flex flex-col gap-10 w-full md:w-1/3 relative z-10">
            {contactCards.map((item, i) => (
              <div
                key={i}
                onClick={() => (item.isMap || item.isEmail) && handleClick(item)}
                className={`flex items-center gap-5 cursor-pointer p-6 rounded-xl shadow-md hover:shadow-lg transition bg-blue-50`}
              >
                <div className="bg-blue-100 rounded-full p-4">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">{item.title}</h3>
                  <div className="text-blue-800 font-medium">{item.details}</div>
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-blue-50 p-10 rounded-3xl shadow-xl w-full md:w-1/2 relative z-10"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-8">Send us a message</h2>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              required
              className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={6}
              required
              className="w-full p-4 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8 resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition"
            >
              Send Message
            </button>
            {status && (
              <p
                className={`mt-4 text-center ${
                  status.includes("Oops") ? "text-red-600" : "text-green-600"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </section>

      <section id="map-section" className="py-32 bg-blue-50">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-900">You're welcome anytime</h2>
          <p className="text-lg text-blue-800 mb-12 max-w-2xl mx-auto">
            Come explore CoSpace and find the environment that suits your ambition. Navigate our world through the map below.
          </p>
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px] border-4 border-white">
            <iframe
            src="https://www.google.com/maps?q=ZenVen+1+Str.+Enver+Maloku,+No.10,+Prishtinë,+Kosovo&hl=en&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
