import * as dotenv from 'dotenv';
dotenv.config();
import express, { urlencoded } from "express";
import cors from 'cors';
import mongoose from "mongoose";
import toDo from "./toDo.mjs";

const connectionString= process.env.CONNECTION_STRING;



const app = express();

app.use(urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.use(cors);

const PORT = process.env.PORT || 8000;


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(connectionString,
    ()=>{ console.log("MongoDB connected");},
    (e)=>{console.log({error:e.message})}
    );
  };





app.get("/", (req,res)=>{
    res.send("This is a backend route please go localHost: 3000");
})

app.get("/api/loadtoDos",  async (req,res)=>{
    try{
       const toDos = await toDo.find();
        const toDoList= JSON.stringify(toDos);
       res.send(toDoList);
    }

        catch(error){
            console.log(error)
        }

});


    app.delete("/api/deleteOne", async (req,res)=>{
        const deletedId =req.body.id;
        try{
            await toDo.deleteOne({id:deletedId})

        }
        catch(error){
                console.log(error)
        }




    })


    app.delete("/api/deleteComplete", async (req,res)=>{
        try{
           await toDo.deleteMany({complete:true});

            const toDos = await toDo.find();
        }

        catch(error){
            console.log(error)
        }
    })

    app.put("/api/completeOne", async (req,res)=>{
       const completeOneID= req.body.id;
       try{
            await toDo.findOneAndUpdate({id:completeOneID}, [{$set:{complete:{$eq:[false,"$complete"]}}}] )
       }
       catch(error){
            console.log(error);
       }
    })


    app.post("/api/addOne",  async (req,res)=>{

       try{
     const todo=  await toDo.create({
            id:req.body.id,
            text: req.body.text,
            complete:req.body.complete
        })
        await todo.save()
       }
       catch(e){
        console.log(Error(e.message));
       }



    })

    app.listen(PORT, ()=>{
        console.log(`listening on port: ${PORT}`);
    });

