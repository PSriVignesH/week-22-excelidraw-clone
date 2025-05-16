import express from 'express'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import { CreateUserSchema, CreateRoomSchema, SigninUserSchema } from '@repo/common/types'
import { prismaClient } from '@repo/db/client';
const app = express()
app.use(express.json())

app.post("/signup",async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error);
    
    res.json({
      message: "Incorrect Input",
      status:400
    })
    return
  }

  try {
   const user =  await prismaClient.user.create({
    data: {
      email: parsedData.data.username,
      password: parsedData.data.password,
      name:parsedData.data.name
    }
   })
    
    res.json({
      userId:user.id
    })
  } catch (e) {
    res.status(411).json({
       message:"User already exists with the username"
     })
  }
})
 
app.post("/signin", async(req, res) => {
  const parsedData = SigninUserSchema.safeParse(req.body)
  if (!parsedData.success) {
    console.log(parsedData.error);
    
    res.json({
      message: "Incorrect Input",
      status:400
    })
    return
  }
  
try {
    const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password:parsedData.data.password
    }
  })
  
  if (!user) {
    res.status(403).json({
      message:"Not authorized"
    })
    return
  }

  const token = jwt.sign( user.id, JWT_SECRET)
  res.json({
     token
  })
} catch (e) {
   res.status(401).json({
       message:"Unauthorized"
     })
}
  })  


app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // @ts-ignore: TODO: Fix this
    const userId = req.userId;
    console.log("userId",userId);
    
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (e) {
      console.log("error",e);
      
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

app.listen(3001)
             