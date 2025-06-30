import type { loginData, LoginResponse, ShortenedUrl, signUpData, SignupResponse } from "../types/IUser";
import userApi from "./api";

export const userService = {
  signup: async (signupData: signUpData): Promise<SignupResponse> => {
    const response = await userApi.post("/register", signupData);
    return response.data;
  },

  login: async (loginData: loginData): Promise<LoginResponse> => {
    const response = await userApi.post("/login", loginData);
    return response.data; 
  },
  shorten: async (originalUrl: string): Promise<any> => {
  const response = await userApi.post("/shorten", { originalUrl });
  return response.data;
},

getUrls: async (): Promise<ShortenedUrl[]> => {
  const response = await userApi.get("/urls");
  return response.data;
},
deleteUrl:async(id:string):Promise<void>=>{
const response= await userApi.delete(`/url/${id}`);
return response.data;
},
 logout: async (): Promise<{}> => {
    try {
      await userApi.post("/logout"); 
    } catch (error) {
      console.warn("Backend logout failed or not implemented", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {};
  },
};
