import { Request,Response } from "express";
import { signupSchema } from "../validations/signup.schema";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs"


//SignUp logic
export const signup = async(req:Request,res:Response) =>{
    try{
        const validatedData = signupSchema.parse(req.body)

        const existingUsers = await prisma.user.findUnique({
            where:{
                email: validatedData.email,
            },
        });
        if(existingUsers){
            return res.status(400).json({
                message:"User already exists",  
            });
        }

        const hashedPassword = await bcrypt.hash(
            validatedData.password,10
        )

        const user = await prisma.user.create({
            data:{
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message:"User created successfully",
            user,
        });

    }catch(error){

        console.log(error);

        return res.status(500).json({message:"Internal server error"});
    }
};