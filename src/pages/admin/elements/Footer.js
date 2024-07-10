import React from "react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaTwitch,
} from "react-icons/fa";

const sections = ["Pricing", "Documentation", "Guides", "API Status"];

const items = [
  { name: "Facebook", icon: FaFacebook, link: "https://www.facebook.com/" },
  { name: "Instagram", icon: FaInstagram, link: "https://www.instagram.com/" },
  { name: "Twitter", icon: FaTwitter, link: "https://twitter.com/" },
  { name: "Twitch", icon: FaTwitch, link: "https://www.twitch.tv/" },
  { name: "Github", icon: FaGithub, link: "https://github.com/" },
];

const Footer = () => {
  return (
    <div className="w-full mt-24 bg-gray-200 text-gray-300 pl-64 py-y px-2">
      <div className="flex justify-center gap-10 border-gray-600 py-8">
          {sections.map((item, i) => (
            <ul>
              <li key={i} className="py-1 text-gray-500 hover:text-white">
                {item}
              </li>
            </ul>
          ))}
        </div>
      <div className="flex flex-col py-4 justify-between text-center text-gray-500">
        <div className="ml-auto flex text-xl gap-5">
          {items.map((x, index) => {
            return <x.icon key={index} className="hover:text-white" />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
