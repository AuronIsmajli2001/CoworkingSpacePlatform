// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "../../components/Header";
// import { useAuth } from "../../context/AuthContext";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

// const MyMembership = () => {
//   const { user } = useAuth();
//   const [membership, setMembership] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [noMembership, setNoMembership] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const fetchMembership = async () => {
//     if (!user?.userId) {
//       setLoading(false);
//       setError("User not authenticated");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:5234/Membership/by-user/${user.userId}`
//       );

//       if (response.data.success === false) {
//         setError(response.data.message || "No active membership found");
//         setMembership(null);
//       } else {
//         setMembership(response.data);
//         setError(null);
//       }
//     } catch (err: any) {
//       console.error("API Error:", err);
//       if (err.response) {
//         if (err.response.status === 404) {
//           setError("User or membership not found");
//         } else if (err.response.status === 500) {
//           setError("Server error. Please try again later");
//         } else {
//           setError(err.response.data?.message || "Failed to load membership");
//         }
//       } else if (err.request) {
//         setError("Network error. Please check your connection");
//       } else {
//         setError(err.message || "An unexpected error occurred");
//       }
//       setMembership(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMembership();
//   }, [user?.userId]);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-GB", {
//       style: "currency",
//       currency: "GBP",
//     }).format(price);
//   };

//   const handleCancelMembership = () => {
//     Swal.fire({
//       title: "Cancel Membership",
//       text: "Are you sure you want to cancel your membership?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, cancel it!",
//     }).then(async (result) => {
//       if (result.isConfirmed && user?.userId) {
//         try {
//           await axios.post(
//             "http://localhost:5234/Membership/cancel",
//             user.userId,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           Swal.fire(
//             "Cancelled!",
//             "Your membership has been cancelled.",
//             "success"
//           );

//           // Refresh state
//           setMembership(null);
//           setError("You have no active membership.");
//         } catch (error) {
//           console.error("Failed to cancel membership", error);
//           Swal.fire(
//             "Error",
//             "Failed to cancel membership. Please try again later.",
//             "error"
//           );
//         }
//       }
//     });
//   };

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center"></div>

//           {loading ? (
//             <div className="flex justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//             </div>
//           ) : error ? (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-red-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                   {!user?.userId && (
//                     <div className="mt-2 text-sm text-red-700">
//                       Please sign in to view your membership.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : membership ? (
//             <div className="bg-white shadow overflow-hidden rounded-lg">
//               <div className="px-4 py-5 sm:px-6 bg-green-100">
//                 <h3 className="text-lg leading-6 font-medium text-green-800">
//                   Active Membership
//                 </h3>
//               </div>
//               <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
//                 <dl className="sm:divide-y sm:divide-gray-200">
//                   <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                     <dt className="text-sm font-medium text-gray-500">Plan</dt>
//                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                       {membership.title}
//                     </dd>
//                   </div>
//                   <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                     <dt className="text-sm font-medium text-gray-500">
//                       Billing
//                     </dt>
//                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                       {membership.billingType}
//                     </dd>
//                   </div>
//                   <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                     <dt className="text-sm font-medium text-gray-500">Price</dt>
//                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                       {formatPrice(membership.price)}
//                       {membership.includesVAT && " (VAT included)"}
//                     </dd>
//                   </div>
//                   <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                     <dt className="text-sm font-medium text-gray-500">
//                       Description
//                     </dt>
//                     <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                       {membership.description}
//                     </dd>
//                   </div>
//                   {membership.additionalServices && (
//                     <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                       <dt className="text-sm font-medium text-gray-500">
//                         Additional Services
//                       </dt>
//                       <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                         {membership.additionalServices}
//                       </dd>
//                     </div>
//                   )}
//                 </dl>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h2 className="mt-2 text-lg font-medium text-gray-900">
//                 No active membership
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 You haven't purchased any memberships yet.
//               </p>
//               <div className="mt-6">
//                 <button
//                   type="button"
//                   className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                 >
//                   Browse Memberships
//                 </button>
//               </div>
//             </div>
//           )}

//           {membership && (
//             <div className="mt-6 flex justify-center">
//               <button
//                 type="button"
//                 onClick={handleCancelMembership}
//                 className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//               >
//                 Cancel Membership
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MyMembership;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MyMembership = () => {
  const { user } = useAuth();
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noMembership, setNoMembership] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMembership = async () => {
    if (!user?.userId) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5234/Membership/by-user/${user.userId}`
      );

      if (response.data.success === false) {
        const msg = response.data.message || "";
        if (msg.toLowerCase().includes("no active membership")) {
          setNoMembership(true);
          setError(null);
        } else {
          setError(msg);
        }
        setMembership(null);
      } else {
        setMembership(response.data);
        setError(null);
      }
    } catch (err: any) {
      console.error("API Error:", err);
      if (err.response) {
        if (err.response.status === 404) {
          setError("User or membership not found");
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later");
        } else {
          setError(err.response.data?.message || "Failed to load membership");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, [user?.userId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  const handleCancelMembership = () => {
    Swal.fire({
      title: "Cancel Membership",
      text: "Are you sure you want to cancel your membership?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed && user?.userId) {
        try {
          await axios.post(
            "http://localhost:5234/Membership/cancel",
            user.userId,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          Swal.fire(
            "Cancelled!",
            "Your membership has been cancelled.",
            "success"
          );

          // Refresh state
          setMembership(null);
          setError("You have no active membership.");
        } catch (error) {
          console.error("Failed to cancel membership", error);
          Swal.fire(
            "Error",
            "Failed to cancel membership. Please try again later.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center"></div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-sm text-red-600">{error}</div>
          ) : membership ? (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-green-100">
                <h3 className="text-lg leading-6 font-medium text-green-800">
                  Active Membership
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Plan</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {membership.title}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Billing
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {membership.billingType}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatPrice(membership.price)}
                      {membership.includesVAT && " (VAT included)"}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {membership.description}
                    </dd>
                  </div>
                  {membership.additionalServices && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Additional Services
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {membership.additionalServices}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ) : noMembership ? (
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
                No active membership
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                You haven't purchased any memberships yet.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/pricingplans")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
                >
                  View Available Memberships
                </button>
              </div>
            </div>
          ) : null}

          {membership && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleCancelMembership}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Membership
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyMembership;
