import express from 'express'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {CreateUserSchema,CreateRoomSchema,SigninUserSchema} from '@repo/common/types'
const app = express()

app.post("/signin", (req, res) => {
  const data = SigninUserSchema.safeParse(req.body)
  if (!data.success) {
    res.json({
      message: "Incorrect Input",
      status:400
    })
    return
  }
  const userid = req.body.userid

  const token = jwt.sign(userid, JWT_SECRET)
  res.json({
     token
  })
  })  

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body)
  if (!data.success) {
    res.json({
      message: "Incorrect Input",
      status:400
    })
    return
  }
  console.log(req.body); 
})

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body)
  if (!data.success) {
    res.json({
      message: "Incorrect Input",
      status:400
    })
    return
  }
})

app.listen(3001)
             