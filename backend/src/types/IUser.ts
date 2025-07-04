import { Request } from "express";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
    email:string;
    password:string;
}


export interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}