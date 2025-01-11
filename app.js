const express = require("express");
const req = require("express/lib/request");
const mongoose = require("mongoose");
const app = express();
const port = 5500;

const mongoUrl = "mongodb://localhost:27017/ExpenseTracker"; 

mongoose.connect(mongoUrl)
.then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
})
.catch((err) => console.log(err));

const expenseSchema=new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true}
});

const expenseModel=mongoose.model("expense-tracker",expenseSchema)

app.get("/api/expenses",async(req,res)=>{
    try
    {
       const expenses=await expenseModel.find();
       res.status(200).json(expenses);
    }
    catch(error)
    {
        res.status(500).json({message:"Failed to fetch expenses"});
    }
});

app.get('/api/expenses/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const expense=await expenseModel.findOne({id})
    if(!expense)
    {
        return res.status(404).json({message: "Expense not found"});
    }
    res.status(200).json(expense);
}
catch(error){
    res.status(500).json({message:"Error in fetch expenses"})
}
}) 

app.use(express.json());

const { v4: uuidv4 } = require("uuid");

//post
app.post("/api/expenses", async (req, res) => {
    try {
        const data = req.body; 

        const newExpense = new expenseModel({
            id: uuidv4(),
            title: data.title,
            amount: data.amount,
        });

        const savedExpense = await newExpense.save();
        res.status(200).json(savedExpense);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error saving expense", error: error.message });
    }
});

//put-update
app.put("/api/expenses/:id",async(req,res)=>{
    const{id}=req.params;
    const {title,amount}=req.body;
    console.log({title})
    try{
        const updateExpense=await expenseModel.findOneAndUpdate(
            {id},
            {title,amount}
        );
        if(!updateExpense)
        {
            return res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount})
    }
    catch(error){
        res.sendStatus(500).json({message:"Error in updating the message"});
    }
});