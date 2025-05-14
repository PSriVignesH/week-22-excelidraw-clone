import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(30),
  password: z.string(), 
  name:z.string()
})

export const SigninUserSchema = z.object({
  username: z.string().min(1).max(30),
  password: z.string(), 
})

export const CreateRoomSchema = z.object({
  name: z.string().min(1).max(20),
})