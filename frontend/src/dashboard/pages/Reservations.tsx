import Sidebar from "../components/Sidebar";
const Reservations = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Reservations Page</h1>
      </div>
    </div>
  );
};

export default Reservations;
