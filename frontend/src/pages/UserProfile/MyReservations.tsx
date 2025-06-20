import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservationEquipments, setReservationEquipments] = useState<{ [key: string]: any[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.userId) {
        setLoading(false);
        setError("User not authenticated");
        return;
      }

      try {
        const response = await api.get(
          `${baseUrl}/Reservation/by-user/${user.userId}`
        );

        if (response.data.success === false) {
          // Only set error if it's a real error, not just empty results
          if (response.data.message !== "No reservations found for this user.") {
            setError(response.data.message);
          }
          setReservations([]);
          setReservationEquipments({});
        } else {
          setReservations(response.data.reservations || []);
          setError(null);

          // Fetch equipments for each reservation
          const equipmentPromises = (response.data.reservations || []).map(async (reservation: any) => {
            try {
              const eqRes = await api.get(`${baseUrl}/ReservationEquipment/${reservation.id}`);
              console.log('Equipment API response for reservation', reservation.id, eqRes.data);
              const equipments = eqRes.data.equipments || eqRes.data || [];
              return { id: reservation.id, equipments };
            } catch (err) {
              console.log('Equipment API error for reservation', reservation.id, err);
              return { id: reservation.id, equipments: [] };
            }
          });

          const equipmentResults = await Promise.all(equipmentPromises);
          const equipmentMap: { [key: string]: any[] } = {};
          equipmentResults.forEach(({ id, equipments }) => {
            equipmentMap[id] = equipments;
          });
          setReservationEquipments(equipmentMap);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError("No reservations found");
          } else if (err.response.status === 500) {
            setError("Server error. Please try again later");
          } else {
            setError(err.response.data?.message || "Failed to load reservations");
          }
        } else if (err.request) {
          setError("Network error. Please check your connection");
        } else {
          setError(err.message || "An unexpected error occurred");
        }
        setReservations([]);
        setReservationEquipments({});
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user?.userId]);

  // Debug log for reservationEquipments state
  useEffect(() => {
    if (!loading) {
      console.log('reservationEquipments state:', reservationEquipments);
    }
  }, [reservationEquipments, loading]);

const handleCancelReservation = (reservationId: string) => {
  Swal.fire({
    title: "Cancel Reservation",
    text: "Are you sure you want to cancel this reservation?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, cancel it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await api.post(`${baseUrl}/Reservation/cancel/${reservationId}`);

        const success =
          (typeof res.data === "string" && res.data.toLowerCase().includes("cancelled")) ||
          res.status === 200;

        if (success) {
          Swal.fire("Cancelled!", "Your reservation has been cancelled.", "success");
          setReservations(prev =>
            prev.map(r => r.id === reservationId ? { ...r, status: "Cancelled" } : r)
          );
        } else {
          Swal.fire("Error", "Cancellation failed. Try again.", "error");
        }
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Failed to cancel the reservation.", "error");
      }
    }
  });
};

const isCancellable = (createdAt: string, status: string) => {
  if (status.toLowerCase() === "cancelled") return false;
  const now = new Date();
  const created = new Date(createdAt);
  const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 48;
};


  return (
    <>
      <Header />
      {/* Add padding top to separate header */}
      <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
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
            <>
              <div className="space-y-6">
                {reservations.map((reservation, idx) => (
                  <div
                    key={idx}
                    className="bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="px-6 py-5 bg-blue-100 rounded-t-xl">
                      <h3 className="text-xl font-semibold text-blue-800">
                        Space : {reservation.space?.name || reservation.spaceId}
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
                        {reservationEquipments[reservation.id] && reservationEquipments[reservation.id].length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 bg-blue-50 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                  <th className="px-4 bg-blue-50 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                                  <th className="px-4 bg-blue-50 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reservationEquipments[reservation.id].map((eq: any, i: number) => (
                                  <tr key={i}>
                                    <td className="px-4 py-2 whitespace-nowrap">{eq.name || '-'}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{eq.type || '-'}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{eq.quantity || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No equipments included.</p>
                        )}
                      </div>
                      {isCancellable(reservation.createdAt, reservation.status) && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}

                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">
                No reservations found
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any reservations yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/space")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Explore Spaces
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyReservations;
