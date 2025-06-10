import api from "./axiosConfig";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post<AuthResponse>("/api/Auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const signUp = async (
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string
): Promise<void> => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("email", email);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);

  await api.post("/api/Auth/signup", formData);
};

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get("/auth/GetCurrentUser");
  return response.data;
};

export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    await api.post("/api/Auth/revoke-token", { refreshToken });
  }
  localStorage.clear();
};
