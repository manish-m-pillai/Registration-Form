import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@registration-form.sa2cpnz.mongodb.net/registrartionFormDB`);
// Registration Schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

// Model of registration Schema
const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get("/",(req,res) => {
    res.sendFile(__dirname+"/pages/index.html");
});

app.post("/register",async(req,res) => {
    try{
        const {name, email, paasword} = req.body;
        const existingUser = await Registration.findOne({email : email});
        // Check for Existing User
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password 
            });
             await registrationData.save();
             res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
    }
    catch(error){
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success",(req,res) => {
    res.sendFile(__dirname+"/pages/success.html");
});

app.get("/error",(req,res) =>{
    res.sendFile(__dirname+"/pages/error.html");
});




app.listen(port,() => {
    console.log(`Server Listening on Port ${port}`);
});

