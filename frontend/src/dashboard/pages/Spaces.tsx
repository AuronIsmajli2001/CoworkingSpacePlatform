import Sidebar from "../components/Sidebar";

const Spaces = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold-black mb-4">Spaces</h1>
      </div>
    </div>
  );
};

export default Spaces;
