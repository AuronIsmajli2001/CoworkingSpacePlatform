import { useState } from "react";

import Room1 from "../images/Conferenceroom1.jpg";
import Room2 from "../images/Conferenceroom2.jpg";
import Room3 from "../images/Conferenceroom3.jpg";
import Room4 from "../images/Conferenceroom4.jpg";
import Room5 from "../images/Conferenceroom5.jpg";
import Room6 from "../images/Conferenceroom6.jpg";
import DedicatedDesk1 from "../images/DedicatedDesk1.jpg";
import DedicatedDesk2 from "../images/DedicatedDesk2.png";
import private_office_1 from "../images/private_office_1.png";
import private_office_2 from "../images/private_office_2.png";
import private_office_3 from "../images/private_office_3.png";
import private_office_4 from "../images/private_office_4.png";
import eventArea from "../images/eventArea.jpeg";
import eventArea2 from "../images/eventArea2.jpeg";
import Kitchen from "../images/Kitchen.jpeg";
import Header from "../components/Header";

type Space = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
};

const allSpaces: Space[] = [
  {
    id: "1",
    name: "Conference Room 1",
    type: "Conference Room",
    imageUrl: Room1,
  },
  {
    id: "2",
    name: "Dedicated Desk",
    type: "Dedicated Desk",
    imageUrl: DedicatedDesk1,
  },
  {
    id: "11",
    name: "Dedicated Desk",
    type: "Dedicated Desk",
    imageUrl: DedicatedDesk2,
  },
  {
    id: "3",
    name: "Executive Events Area",
    type: "Events Area",
    imageUrl: eventArea,
  },
  {
    id: "4",
    name: "Private Office - ZenDen 1",
    type: "Private Office",
    imageUrl: private_office_1,
  },
  {
    id: "13",
    name: "Private Office - ZenDen 1",
    type: "Private Office",
    imageUrl: private_office_2,
  },
  {
    id: "5",
    name: "ZenVen 2 - Team Office",
    type: "Private Office",
    imageUrl: private_office_3,
  },

  {
    id: "6",
    name: "Kitchen",
    type: "All",
    imageUrl: Kitchen,
  },
  {
    id: "7",
    name: "Conference Room 3",
    type: "Conference Room",
    imageUrl: Room3,
  },
  {
    id: "8",
    name: "Conference Room 4",
    type: "Conference Room",
    imageUrl: Room4,
  },
  // {
  //   id: "9",
  //   name: "Conference Room 5",
  //   type: "Conference Room",
  //   imageUrl: Room5,
  // },
  {
    id: "10",
    name: "Conference Room 6",
    type: "Conference Room",
    imageUrl: Room6,
  },
  {
    id: "12",
    name: "ZenVen 2 - Team Office",
    type: "Private Office",
    imageUrl: private_office_4,
  },
  {
    id: "14",
    name: "ZenVen 2 - Team Office",
    type: "Events Area",
    imageUrl: eventArea2,
  },
];

const categories = [
  "All",
  "Conference Room",
  "Events Area",
  "Dedicated Desk",
  "Private Office",
];

export default function Spaces() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSpaces =
    activeCategory === "All"
      ? allSpaces
      : allSpaces.filter((space) => space.type === activeCategory);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="text-center py-16 bg-white">
          <h1 className="text-4xl font-bold text-gray-900">
            Explore Our Workspaces
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Find the perfect space for your work style
          </p>
        </section>

        {/* Categories */}
        <div className="flex justify-center space-x-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border font-medium text-sm transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 px-6 pb-16 mx-auto w-4/5">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-2xl overflow-hidden shadow transition hover:shadow-lg hover:-translate-y-1 duration-400"
            >
              <img
                src={space.imageUrl}
                alt={space.name}
                className="w-full h-56 min-h-[300px] object-cover rounded-t-2xl"
              />
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {space.name}
                </h3>
                <button className="text-blue-600 font-medium text-sm hover:underline">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
