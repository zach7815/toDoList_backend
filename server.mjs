import * as dotenv from 'dotenv';
dotenv.config();
import express, { urlencoded } from "express";
import mongoose, {Schema} from "mongoose";


const app = express();
const connectionString= process.env.CONNECTION_STRING;

mongoose.set('strictQuery', false);

const toDoSchema=  new Schema({
    id:Number,
    text:String,
    complete:Boolean
});


app.use(urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "https://todo-app-frontend-obe0.onrender.com" );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });




const PORT = process.env.PORT || 8000;


main();

async function main() {
    try{
        await mongoose.connect(connectionString);
         await mongoose.model("toDo", toDoSchema);


    }

    catch(error){
        console.log(error);
    }
  };
    main();
    const toDo= await mongoose.model("toDo", toDoSchema);



app.get("/", (req,res)=>{
    res.send("This is a backend route please go to the front end");
})

app.get("/api/loadtoDos",  async (req,res)=>{
    try{
       const toDos = await toDo.find();
       console.log(toDos);
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

