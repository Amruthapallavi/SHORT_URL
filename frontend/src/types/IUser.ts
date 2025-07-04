export interface signUpData{
name:string;
email:string;
password:string
}

export interface SignupResponse {
  message: string;
}
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface loginData{
    email:string;
    password:string;
}
export interface ShortenedUrl {
  _id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  __v?: number;
}
export interface UrlData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  title?: string;
}


export interface shortenURLApiResponse {
  data: UrlData;
  message: string;
}