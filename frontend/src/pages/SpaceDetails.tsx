import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { Users, MapPin, Euro, Info } from "lucide-react";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

interface ReservationData {
  paymentMethod: "Cash" | "Card" | "";
  startDateTime: string;
  endDateTime: string;
}

interface DecodedToken {
  userId: string;
}

interface Equipment {
  id: string;
  name: string;
  price_per_piece?: number;
}

interface EquipmentSelection {
  equipmentId: string;
  quantity: number;
}

export default function SpaceDetails() {
  const navigate = useNavigate();
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<
    EquipmentSelection[]
  >([]);
  const [currentReservationId, setCurrentReservationId] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [formErrors, setFormErrors] = useState({
    paymentMethod: "",
    startDateTime: "",
    endDateTime: "",
    dateRange: "",
  });

  const { id } = useParams();
  const [space, setSpace] = useState<any>(null);
  const [reservationData, setReservationData] = useState<ReservationData>({
    paymentMethod: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`${baseUrl}/Space/${id}`)
      .then((res) => {
        setSpace({
          ...res.data,
          imageUrl: res.data.image_URL,
        });
      })
      .catch((err) => console.error("Error fetching space:", err));
  }, [id]);

  useEffect(() => {
    if (!space) return;

    const start = reservationData.startDateTime
      ? new Date(reservationData.startDateTime)
      : null;
    const end = reservationData.endDateTime
      ? new Date(reservationData.endDateTime)
      : null;
    let hours = 0;

    if (start && end && end > start) {
      hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    let spaceTotal = hours * Number(space.price || 0);
    let equipmentTotal = selectedEquipment.reduce((sum, sel) => {
      const eq = equipmentList.find((e) => e.id === sel.equipmentId);
      return sum + (eq?.price_per_piece || 0) * sel.quantity;
    }, 0);

    setTotalPrice(spaceTotal + equipmentTotal);
  }, [reservationData, space, selectedEquipment, equipmentList]);

  const validateForm = () => {
    const errors = {
      paymentMethod: "",
      startDateTime: "",
      endDateTime: "",
      dateRange: "",
    };
    let isValid = true;

    if (!reservationData.paymentMethod) {
      errors.paymentMethod = "Please select a payment method";
      isValid = false;
    }

    if (!reservationData.startDateTime) {
      errors.startDateTime = "Please select a start date and time";
      isValid = false;
    }

    if (!reservationData.endDateTime) {
      errors.endDateTime = "Please select an end date and time";
      isValid = false;
    }

    if (reservationData.startDateTime && reservationData.endDateTime) {
      const start = new Date(reservationData.startDateTime);
      const end = new Date(reservationData.endDateTime);

      if (end <= start) {
        errors.dateRange = "End time must be after start time";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleReservationChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is changed
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
        dateRange:
          name === "startDateTime" || name === "endDateTime"
            ? ""
            : prev.dateRange,
      }));
    }
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in to make a reservation");
        return;
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      const reservationId = uuidv4();

      const response = await axios.post(
        `${baseUrl}/Reservation`,
        {
          id: reservationId,
          userId: decodedToken.userId,
          spaceId: id,
          paymentMethod: reservationData.paymentMethod,
          isPaid: reservationData.paymentMethod === "Card",
          startDateTime: reservationData.startDateTime,
          endDateTime: reservationData.endDateTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setCurrentReservationId(reservationId);
        const equipmentResponse = await axios.get(`${baseUrl}/Equipment`);
        setEquipmentList(equipmentResponse.data);
        setShowEquipmentModal(true);
      }
    } catch (err: any) {
      console.error("Error creating reservation:", err);
      setError(err.response?.data?.message || "Failed to create reservation");
    }
  };

  const handleEquipmentSubmit = async () => {
    try {
      if (selectedEquipment.length > 0) {
        await axios.post(`${baseUrl}/ReservationEquipment`, {
          reservationId: currentReservationId,
          equipmentIds: selectedEquipment.map((eq) => eq.equipmentId),
          quantity: selectedEquipment.map((eq) => eq.quantity),
        });
      }

      setShowEquipmentModal(false);
      setSuccess(
        selectedEquipment.length > 0
          ? "Reservation created successfully with equipment!"
          : "Reservation created successfully!"
      );

      setReservationData({
        paymentMethod: "",
        startDateTime: "",
        endDateTime: "",
      });
      setSelectedEquipment([]);
    } catch (err: any) {
      console.error("Error adding equipment:", err);
      setError(err.response?.data?.message || "Failed to add equipment");
    }
  };

  const handleEquipmentChange = (equipmentId: string, quantity: number) => {
    setSelectedEquipment((prev) => {
      const existing = prev.find((eq) => eq.equipmentId === equipmentId);
      if (existing) {
        return quantity === 0
          ? prev.filter((eq) => eq.equipmentId !== equipmentId)
          : prev.map((eq) =>
              eq.equipmentId === equipmentId ? { ...eq, quantity } : eq
            );
      }
      return [...prev, { equipmentId, quantity }];
    });
  };

  if (!space) return <p className="text-center mt-10">Loading...</p>;

  const isFormValid =
    reservationData.paymentMethod &&
    reservationData.startDateTime &&
    reservationData.endDateTime &&
    new Date(reservationData.endDateTime) >
      new Date(reservationData.startDateTime);

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
          <div className="bg-white p-12 rounded-xl shadow-lg flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {space.name}
            </h1>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Users className="text-blue-600" size={28} />
              <div>
                <p className="text-gray-500 font-semibold uppercase text-xs mb-1">
                  Capacity
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {space.capacity}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Euro className="text-green-600" size={28} />
              <div>
                <p className="text-gray-500 font-semibold uppercase text-xs mb-1">
                  Price per Hour
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {space.price} €
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-purple-600" size={28} />
              <div>
                <p className="text-gray-500 font-semibold uppercase text-xs mb-1">
                  Location
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {space.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Info className="text-orange-500" size={28} />
              <div>
                <p className="text-gray-500 font-semibold uppercase text-xs mb-1">
                  Description
                </p>
                <p className="text-base text-gray-800">{space.description}</p>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-white p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)]">
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
                  Payment Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={reservationData.paymentMethod}
                  onChange={handleReservationChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.paymentMethod
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
                {formErrors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.paymentMethod}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  value={reservationData.startDateTime}
                  onChange={handleReservationChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.startDateTime
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.startDateTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.startDateTime}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  value={reservationData.endDateTime}
                  onChange={handleReservationChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.endDateTime
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.endDateTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.endDateTime}
                  </p>
                )}
                {formErrors.dateRange && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.dateRange}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Hour
                </label>
                <input
                  type="text"
                  value={`${space.price} €`}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price
                </label>
                <input
                  type="text"
                  value={`${totalPrice.toFixed(2)} €`}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-bold"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full px-6 py-3 text-white rounded-lg font-semibold ${
                    isFormValid
                      ? "bg-blue-700 hover:bg-blue-800 transition-colors"
                      : "bg-blue-400 cursor-not-allowed"
                  }`}
                >
                  Make Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* Equipment Modal */}
      {showEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add Equipment to Your Reservation
            </h2>

            <div className="space-y-4">
              {selectedEquipment.map((selection, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <select
                    value={selection.equipmentId}
                    onChange={(e) =>
                      handleEquipmentChange(e.target.value, selection.quantity)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((equipment) => (
                      <option
                        key={equipment.id}
                        value={equipment.id}
                        disabled={selectedEquipment.some(
                          (sel, i) =>
                            i !== index && sel.equipmentId === equipment.id
                        )}
                      >
                        {equipment.name}
                        {equipment.price_per_piece
                          ? ` (€${equipment.price_per_piece.toFixed(2)})`
                          : ""}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selection.quantity}
                    onChange={(e) =>
                      handleEquipmentChange(
                        selection.equipmentId,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() =>
                      handleEquipmentChange(selection.equipmentId, 0)
                    }
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setSelectedEquipment([
                    ...selectedEquipment,
                    { equipmentId: "", quantity: 1 },
                  ])
                }
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Equipment
              </button>
            </div>

            <div className="mt-6 flex flex-col items-end gap-2">
              <div className="text-lg font-semibold text-gray-700">
                Equipment Total:{" "}
                {selectedEquipment
                  .reduce((sum, sel) => {
                    const eq = equipmentList.find(
                      (e) => e.id === sel.equipmentId
                    );
                    return sum + (eq?.price_per_piece || 0) * sel.quantity;
                  }, 0)
                  .toFixed(2)}{" "}
                €
              </div>
              <div className="text-lg font-bold text-blue-700">
                Grand Total: {totalPrice.toFixed(2)} €
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleEquipmentSubmit}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Skip Equipment
              </button>
              <button
                onClick={handleEquipmentSubmit}
                disabled={selectedEquipment.some((eq) => !eq.equipmentId)}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
