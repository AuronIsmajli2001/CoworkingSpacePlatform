import { useState, useEffect } from "react";
import axios from "axios";
<<<<<<< HEAD
import Footer from "../components/Footer";

=======
import React from "react";
>>>>>>> aur_loginChange
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

type Space = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
};

// const allSpaces: Space[] = [
//   {
//     id: "1",
//     name: "Conference Room 1",
//     type: "Conference Room",
//     imageUrl: Room1,
//   },
//   {
//     id: "2",
//     name: "Dedicated Desk",
//     type: "Dedicated Desk",
//     imageUrl: DedicatedDesk1,
//   },
//   {
//     id: "11",
//     name: "Dedicated Desk",
//     type: "Dedicated Desk",
//     imageUrl: DedicatedDesk2,
//   },
//   {
//     id: "3",
//     name: "Executive Events Area",
//     type: "Events Area",
//     imageUrl: eventArea,
//   },
//   {
//     id: "4",
//     name: "Private Office - ZenDen 1",
//     type: "Private Office",
//     imageUrl: private_office_1,
//   },
//   {
//     id: "13",
//     name: "Private Office - ZenDen 1",
//     type: "Private Office",
//     imageUrl: private_office_2,
//   },
//   {
//     id: "5",
//     name: "ZenVen 2 - Team Office",
//     type: "Private Office",
//     imageUrl: private_office_3,
//   },

//   {
//     id: "6",
//     name: "Kitchen",
//     type: "All",
//     imageUrl: Kitchen,
//   },
//   {
//     id: "7",
//     name: "Conference Room 3",
//     type: "Conference Room",
//     imageUrl: Room3,
//   },
//   {
//     id: "8",
//     name: "Conference Room 4",
//     type: "Conference Room",
//     imageUrl: Room4,
//   },

//   {
//     id: "10",
//     name: "Conference Room 6",
//     type: "Conference Room",
//     imageUrl: Room6,
//   },
//   {
//     id: "12",
//     name: "ZenVen 2 - Team Office",
//     type: "Private Office",
//     imageUrl: private_office_4,
//   },
//   {
//     id: "14",
//     name: "ZenVen 2 - Team Office",
//     type: "Events Area",
//     imageUrl: eventArea2,
//   },
// ];

const categories = [
  "All",
  "Conference Room",
  "Events Area",
  "Dedicated Desk",
  "Private Office",
];

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

export default function Spaces() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    const url = `${baseUrl}/Space`;
    console.log("📡 Requesting spaces from:", url);

    axios
      .get("http://localhost:5234/Space")
      .then((res) => {
        console.log("Spaces from backend:", res.data);

        if (Array.isArray(res.data)) {
          setSpaces(
            res.data.map((space: any) => ({
              id: space.id,
              name: space.name,
              type: space.type,
              imageUrl: space.image_URL,
            }))
          );
        } else {
          console.error("❌ res.data is not an array:", res.data);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching spaces:", err);
      });
  }, []);

  const filteredSpaces =
    activeCategory === "All"
      ? spaces
      : spaces.filter(
          (space) => space.type.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-[7rem] pb-16 bg-white text-center">
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
          {filteredSpaces.map((space) => {
            console.log("🖼️ Rendering image:", space.imageUrl); // ⬅️ Add here
            return (
              <div
                key={space.id}
                className="bg-white rounded-2xl overflow-hidden shadow transition hover:shadow-lg hover:-translate-y-1 duration-400"
              >
                <img
                  onClick={() => navigate(`/space/${space.id}`)}
                  src={space.imageUrl}
                  alt={space.name}
                  className="w-full h-56 min-h-[300px] object-cover rounded-t-2xl"
                />
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {space.name}
                  </h3>
                  <button
                    onClick={() => navigate(`/space/${space.id}`)}
                    className="text-blue-600 font-medium text-sm hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer/>
    </>
  );
}
