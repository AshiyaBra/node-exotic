const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });


mongoose
    .connect("mongodb+srv://ashiyabranch2:ellajones@cluster0.2mkt3ng.mongodb.net/")
    .then(() => console.log("Connected to mongodb..."))
    .catch((err) => console.error("could not conect to mongodb...", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const fruitSchema = new mongoose.Schema({
    name: String,
    color: String,
    family: String,
    place: [String],
    growth: String,
    img: String,
});

const Fruit = mongoose.model("Fruit", fruitSchema);

app.get("/api/fruits", (req, res) => {
    getFruits(res);
});

const getFruits = async (res) => {
    const fruits = await Fruit.find();
    res.send(fruits);
}

app.post("/api/fruits", upload.single("img"), (req, res) => {
    const result = validateFruit(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
      }

    const newFruit = new Fruit({
        
        name: req.body.name,
        color: req.body.color,
        family: req.body.family,
        place: req.body.place.split(","),
        growth: req.body.growth,
       
        
    });

    if(req.file){
        newFruit.img = "images/" + req.file.filename;
    }

    createFruit(newFruit, res);
});

const createFruit = async (newFruit, res) => {
    const result = await newFruit.save();
    res.send(newFruit);
}

app.put("/api/fruits/:id" , upload.single("img"), (req, res) => {
    
    const result = validateFruit(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
      }

    updateFruit(req, res);
});

const updateFruit = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        color: req.body.color,
        family: req.body.family,
        place: req.body.place.split(","),
        growth: req.body.growth,

    };

    if (req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Fruit.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const fruit = await Fruit.findById(req.params.id);
    res.send(fruit);
};

app.delete("/api/fruits/:id", upload.single("img"), (req, res) => {
    removeFruit(res, req.params.id);
});

const removeFruit = async (res, id) =>{
    const fruit = await Fruit.findByIdAndDelete(id);
    res.send(fruit);
}

const validateFruit = (fruit) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        color: Joi.string().min(3).required(),
        family: Joi.string().min(3).required(),
        place: Joi.allow(""),
        growth: Joi.string().min(3).required(),
        
       
    });

    return schema.validate(fruit);
};

app.listen(3000, () => {
    console.log("I'm Listening");
});
