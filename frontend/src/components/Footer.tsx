import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  CreditCard,
  Wallet,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
        {/* 1️⃣ Logo + Desc */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-wider">
            Co<span className="text-blue-500">Space</span>
          </h2>
          <p className="max-w-xs text-sm text-neutral-300">
            Work for yourself, not by yourself. Flexible, connected, inspiring.
          </p>
        </div>

        {/* 2️⃣ Socials + Payments */}
        <div className="space-y-10">
          <div>
            <h4 className="text-2xl font-semibold mb-4">Our Socials</h4>
            <p className="text-white text-[16px] mb-6">
              A monthly digest of the latest news and resources.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* 3️⃣ Contacts */}
        <div className="space-y-8">
          <h4 className="text-2xl font-semibold">Our Contacts</h4>
          {[
            { icon: MapPin, text: "10 B St, Prishtinë, 10000" },
            { icon: Mail, text: "info@cospace.com" },
            { icon: Phone, text: "+383 48 739 738" },
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

      {/* Bottom Bar */}
      <div className="border-t border-neutral-700 text-sm flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-6 container mx-auto">
        <span>© {new Date().getFullYear()} CoSpace. All rights reserved.</span>
        <Link to="/terms" className="hover:text-neutral-400">
          Terms of use
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
