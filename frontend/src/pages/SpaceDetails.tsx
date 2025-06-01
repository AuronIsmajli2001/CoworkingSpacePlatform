import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { Users, MapPin, Euro, Info } from "lucide-react";
import Swal from "sweetalert2";

//@ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL;
//@ts-ignore
const frontUrl = import.meta.env.VITE_FRONTEND_URL;

interface ReservationData {
  paymentMethod: "Cash" | "Card" | "";
  startDateTime: string;
  endDateTime: string;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
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

  const [cardDetails, setCardDetails] = useState<CardDetails>({
  number: "",
  expiry: "",
  cvv: "",
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
    api
      .get(`/Space/${id}`)
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

  if (reservationData.paymentMethod === "Card") {
    const cleanedCardNumber = cardDetails.number.replace(/\s/g, "");
    
    if (!cleanedCardNumber || !cardDetails.expiry || !cardDetails.cvv) {
      errors.paymentMethod = "Please complete all card details";
      isValid = false;
    } else if (cleanedCardNumber.length !== 16) {
      errors.paymentMethod = "Card number must be 16 digits";
      isValid = false;
    } else if (!/^\d+$/.test(cleanedCardNumber)) {
      errors.paymentMethod = "Card number must contain only digits";
      isValid = false;
    }
    
    // Add basic expiry validation (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.paymentMethod = "Expiry must be in MM/YY format";
      isValid = false;
    }
    
    // Add basic CVV validation (3-4 digits)
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.paymentMethod = "CVV must be 3 or 4 digits";
      isValid = false;
    }
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
  
  // Clear card details when switching from Card to another method
  if (name === "paymentMethod" && value !== "Card") {
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
    });
  }

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
    return; // This will stop execution if validation fails
  }

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to make a reservation");
      return;
    }

    const decodedToken = jwtDecode<DecodedToken>(token);
    const reservationId = uuidv4();

    // Process card payment if selected
    if (reservationData.paymentMethod === "Card") {
      // Clear error state before processing payment
      setError(""); 
      
      // Your payment processing logic...
      const paymentSuccess = true; // Replace with actual payment processing
      
      if (!paymentSuccess) {
        throw new Error("Payment processing failed");
      }
    }

    const response = await api.post(`/Reservation`, {
      id: reservationId,
      userId: decodedToken.userId,
      spaceId: id,
      paymentMethod: reservationData.paymentMethod,
      isPaid: reservationData.paymentMethod === "Card",
      startDateTime: reservationData.startDateTime,
      endDateTime: reservationData.endDateTime,
    });

    if (response.status === 200 || response.status === 201) {
       setError("");
      setCurrentReservationId(reservationId);
      const equipmentResponse = await api.get(`/Equipment`);
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
        await api.post(`/ReservationEquipment`, {
          reservationId: currentReservationId,
          equipmentIds: selectedEquipment.map((eq) => eq.equipmentId),
          quantity: selectedEquipment.map((eq) => eq.quantity),
        });
      }

      setShowEquipmentModal(false);
      await Swal.fire({
        icon: "success",
        title: "Reservation Confirmed",
        text:
          selectedEquipment.length > 0
            ? "Reservation created successfully with equipment!"
            : "Reservation created successfully!",
        confirmButtonText: "Okay",
        confirmButtonColor: "#2563EB", // Tailwind blue
        customClass: {
          popup: "rounded-2xl",
        },
      });

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
  (reservationData.paymentMethod !== "Card" ||
    (cardDetails.number &&
      cardDetails.expiry &&
      cardDetails.cvv &&
      cardDetails.number.replace(/\s/g, "").length === 16)) &&
  reservationData.startDateTime &&
  reservationData.endDateTime &&
  new Date(reservationData.endDateTime) > new Date(reservationData.startDateTime);

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
                  formErrors.paymentMethod ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
              {formErrors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{formErrors.paymentMethod}</p>
              )}

              {/* Card Details Section - Only shown when Card is selected */}
              {reservationData.paymentMethod === "Card" && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Card Details</h4>
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-2 border rounded-lg"
                    value={cardDetails.number}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                      if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits
                      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space every 4 digits
                      setCardDetails({ ...cardDetails, number: formatted });
                    }}
                    inputMode="numeric"
                    pattern="[0-9\s]*"
                  />

                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-2 border rounded-lg"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 2) {
                        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                      }
                      if (value.length > 5) value = value.slice(0, 5);
                      setCardDetails({ ...cardDetails, expiry: value });
                    }}
                    maxLength={5}
                  />

                  <input
                    type="text"
                    placeholder="CVV"
                    className="p-2 border rounded-lg"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length > 4) return;
                      setCardDetails({ ...cardDetails, cvv: value });
                    }}
                    maxLength={4}
                    inputMode="numeric"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Your card will be charged immediately upon reservation.
                  </p>
                </div>
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
            key={selection.equipmentId || `new-${index}`} // Fixed key
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <select
              value={selection.equipmentId}
              onChange={(e) => {
                const newEquipment = [...selectedEquipment];
                newEquipment[index].equipmentId = e.target.value;
                setSelectedEquipment(newEquipment);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Equipment</option>
              {equipmentList.map((equipment) => (
                <option
                  key={equipment.id}
                  value={equipment.id}
                  disabled={selectedEquipment.some(
                    (sel, i) => i !== index && sel.equipmentId === equipment.id
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
              onChange={(e) => {
                const newEquipment = [...selectedEquipment];
                newEquipment[index].quantity = parseInt(e.target.value) || 1;
                setSelectedEquipment(newEquipment);
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => {
                setSelectedEquipment(
                  selectedEquipment.filter((_, i) => i !== index)
                );
              }}
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
          onClick={() => {
            // Filter out any empty selections first
            const filteredSelections = selectedEquipment.filter(eq => eq.equipmentId !== "");
            
            // Only add new empty selection if all existing ones have equipment selected
            if (filteredSelections.length === selectedEquipment.length) {
              setSelectedEquipment([
                ...filteredSelections,
                { equipmentId: "", quantity: 1 }
              ]);
            }
          }}
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
        disabled={selectedEquipment.some(eq => !eq.equipmentId || eq.quantity < 1)} 
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
