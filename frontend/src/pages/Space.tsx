import Header from "../components/Header";
const Space = () => {
  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold">Welcome to Space Page</h1>
        <p className="mt-4 text-gray-500">This is your homepage content.</p>
      </div>
    </>
  );
};

export default Space;
