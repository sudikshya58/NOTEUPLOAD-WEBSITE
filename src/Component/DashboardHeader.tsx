export const DashboardHeader = () => {
  const handleLogout = () => {
    localStorage.removeItem("acceessToken");
  };
  return (
    <>
      <div className="bg-white shadow-xl top-0 z-999 w-full fixed p-6">
        <div className="flex justify-between mx-20">
          <img src="" alt="logo" />
          <div className="font-bold text-[20px]" onClick={handleLogout}>
            LOGOUT
          </div>
        </div>
      </div>
    </>
  );
};
