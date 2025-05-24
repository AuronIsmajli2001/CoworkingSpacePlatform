import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

interface ReservationData {
  paymentMethod: "Cash" | "Card";
  startDateTime: string;
  endDateTime: string;
}

interface DecodedToken {
  userId: string;
  // Add other token fields if needed
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

export default function SpaceDetails() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const { id } = useParams();
  const [space, setSpace] = useState<any>(null);
  const [reservationData, setReservationData] = useState<ReservationData>({
    paymentMethod: "Cash",
    startDateTime: "",
    endDateTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`${baseUrl}/Space/${id}`)
      .then((res) => {
        console.log("🧠 Space fetched:", res.data);
        setSpace({
          ...res.data,
          imageUrl: res.data.image_URL,
        });
      })
      .catch((err) => console.error("❌ Error fetching space:", err));
  }, [id]);

  if (isLoading) {
    return null;
  }

  const handleReservationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in to make a reservation");
        return;
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      
      const response = await axios.post(
        `${baseUrl}/Reservation`,
        {
          userId: decodedToken.userId,
          spaceId: id,
          paymentMethod: reservationData.paymentMethod,
          isPaid: reservationData.paymentMethod === "Card",
          startDateTime: reservationData.startDateTime,
          endDateTime: reservationData.endDateTime
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Reservation created successfully!");
        // Clear form
        setReservationData({
          paymentMethod: "Cash",
          startDateTime: "",
          endDateTime: "",
        });
      }
    } catch (err: any) {
      console.error("Error creating reservation:", err);
      setError(err.response?.data?.message || "Failed to create reservation");
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Reservation Form */}
          <div
            className="bg-white p-8 rounded-xl"
            style={{ boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Make a Reservation
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={reservationData.paymentMethod}
                  onChange={handleReservationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  value={reservationData.startDateTime}
                  onChange={handleReservationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  value={reservationData.endDateTime}
                  onChange={handleReservationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
                >
                  Make Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
