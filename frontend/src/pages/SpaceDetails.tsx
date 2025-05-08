import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SpaceDetails() {
  const { id } = useParams();
  const [space, setSpace] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5234/Space/${id}`)
      .then((res) => {
        console.log("🧠 Space fetched:", res.data);
        setSpace({
          ...res.data,
          imageUrl: res.data.image_URL,
        });
      })
      .catch((err) => console.error("❌ Error fetching space:", err));
  }, [id]);

  if (!space) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 pt-[6.5rem] pb-[2.5rem]">
        {/* Image */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <img
            src={space.imageUrl}
            alt={space.name}
            className="w-full h-[300px] object-cover transition hover:scale-[1.01] duration-300"
          />
        </div>

        {/* Space Info */}
        <div
          className="bg-white p-8 rounded-xl"
          style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {space.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg text-gray-700 mb-6">
            <div>
              <p className="text-gray-500 font-semibold uppercase text-sm">
                Capacity
              </p>
              <p className="text-xl font-medium">{space.capacity}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase text-sm">
                Price per hour
              </p>
              <p className="text-xl font-medium">{space.price} €</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase text-sm">
                Location
              </p>
              <p className="text-xl font-medium">{space.location}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 font-semibold uppercase text-sm mb-1">
              Description
            </p>
            <p className="text-base text-gray-800">{space.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
