export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken; // Returns true if accessToken exists, false otherwise
};

export const checkAuthAndRedirect = (navigate: any, fallbackPath = "/auth") => {
  if (!isAuthenticated()) {
    navigate(fallbackPath);
  }
};
