import mongoose from "mongoose";
mongoose.set('strictQuery', false);
const {Schema}=mongoose;

const toDoSchema= new Schema({
    id:Number,
    text:String,
    complete:Boolean
});

const toDo= mongoose.model("toDo", toDoSchema);

export default toDo;