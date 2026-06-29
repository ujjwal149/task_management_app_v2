import {Request,Response} from "express";
import prisma from "../lib/prisma";
import {createTaskSchema} from "../validations/task.schema";

export const createTask = async (
    req:Request,
    res:Response
)   => {
    try{
        const validatedData = createTaskSchema.parse(req.body);
        
        const userId = req.user!.userId;

        const task = await prisma.task.create({
            data:{
                title:validatedData.title,
                description:validatedData.description,
                dueDate:validatedData.dueDate 
                        ? new Date(validatedData.dueDate):null,
                userId,
            },
            
        });
        return res.status(201).json({
            message:"Task created sucessfully.",
            task,
        });

    }catch(error){
        console.error(error)
        
        return res.status(500).json({
            message:"Internal server error.",
        });

    }
}

export const getMyTasks = async(req:Request,res:Response) =>{
    try{
        const userId = req.user!.userId;
        const tasks = await prisma.task.findMany({
            where:{
                userId,
            },

        });
        return res.status(200).json({
            message:"Task fetch sucessfully!",
            tasks,
        })
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message:"Internal server error."
        })
    }
}