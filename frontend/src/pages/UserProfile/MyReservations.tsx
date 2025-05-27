import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.userId) {
        setLoading(false);
        setError("User not authenticated");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5234/Reservation/by-user/${user.userId}`
        );

        if (response.data.success === false) {
          setError(response.data.message || "No reservations found");
          setReservations([]);
        } else {
          setReservations(response.data.reservations || []);
          setError(null);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load reservations");
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user?.userId]);

  return (
    <>
      <Header />
      {/* Add padding top to separate header */}
      <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
              My Reservations
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-100 p-4 shadow-md">
              <div className="flex items-center space-x-3">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          ) : reservations.length > 0 ? (
            <div className="space-y-6">
              {reservations.map((reservation, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="px-6 py-5 bg-green-50 rounded-t-xl">
                    <h3 className="text-xl font-semibold text-green-800">
                      Space: {reservation.space?.name || reservation.spaceId}
                    </h3>
                  </div>
                  <div className="border-t border-gray-300 px-6 py-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">
                          Start Date & Time
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {new Date(reservation.startDateTime).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">
                          End Date & Time
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {new Date(reservation.endDateTime).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">
                          Payment Status
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {reservation.isPaid ? "Paid" : "Not Paid"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">
                          Status
                        </dt>
                        <dd className="mt-1">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              reservation.status.toLowerCase() === "confirmed"
                                ? "bg-green-200 text-green-900"
                                : reservation.status.toLowerCase() === "cancelled"
                                ? "bg-red-200 text-red-900"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {reservation.status}
                          </span>
                        </dd>
                      </div>
                    </dl>

                    {/* Show equipments if available */}
                      <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">
                        Equipments:
                      </h4>
                      {reservation.equipments && reservation.equipments.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-800">
                          {reservation.equipments.map((eq: any, i: number) => (
                            <li key={i}>{eq.name || eq}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No equipments included.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 mt-16">
              <div className="text-7xl select-none">😕</div>
              <h2 className="text-3xl font-semibold text-gray-800">
                You don’t have any reservations yet.
              </h2>
              <button
                onClick={() => navigate("/space")}
                className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors duration-300 shadow-md"
              >
                Explore Spaces
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyReservations;
