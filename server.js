const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images"});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let fruits = [
    {
        _id: 1,
        name: "Açaí Berries",
        color: "Deep Purple",
        family: "Arecaceae",
        place: ["South America", "Central America"],
        growth: "Grows on a plam tree.",
        image: "images/acai.png "
    },
    {
        _id: 2,
        name: "Ackee",
        color: "Orange/Yellow ",
        family: "Sapindaceae",
        place: ["West Africa"],
        growth: "Grows on evergreen trees. ",
        image: "images/ackee.jpg"
    },
    {
        _id: 3,
        name: "Densuke Watermelon",
        color: "Black",
        family: "Cucurbitaceae ",
        place: ["Japan"],
        growth: "Grows on vines. ",
        image: "images/dwater.jpg"
    },
    {
        _id: 4,
        name: "Dragon Fruit",
        color: "Pink or Yellow",
        family: "Cactaceae",
        place: ["Southern Mexico", "Central America"],
        growth: "Groes on a hylocereus cactus.",
        image: "images/dragon-fruit.jpg"
    },
    {
        _id: 5,
        name: "Guava",
        color: "Green",
        family: "Myrtaceae",
        place: ["Central America", "Caribbean"],
        growth: "Grows on a small tree.",
        image: "images/guava.jpg"
    },
    {
        _id: 6,
        name: "Passion Fruit",
        color: "Deep Purple or Yellow",
        family: "Passifloraceae",
        place: ["Southtern Brazil", "Paraguay"],
        growth: "Grows on a vine.",
        image: "images/passionfruit.jpg "
    }
];

app.get("/api/fruits", (req, res) => {
    res.send(fruits);
});

app.post("/api/fruits", upload.single("img"), (req, res) => {
    const result = validateFruit(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const newFruit = {
        _id: fruits.length + 1,
        name: req.body.name,
        color: req.body.color,
        family: req.body.family,
        place: req.body.place.split(","),
        growth: req.body.growth,
        image: req.body.image,
        
    }

    if(req.file){
        newFruit.img = "images/" + req.file.filename;
    }

    fruits.push(newFruit);
    res.send(fruits);
});

app.put("/api/fruits/:id" , upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const fruit = fruits.find((r) => r._id === id);
    const result = validateFruit(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    fruit.name = req.body.name;
    fruit.color = req.body.color;
    fruit.family = req.body.family;
    fruit.place = req.body.place.split(",");
    fruit.growth = req.body.growth;
    fruit.image = req.body.image;

    if(req.file){
        fruit.img = "images/" + req.file.filename;
    }
    res.send(fruit);
});

app.delete("/api/fruits/:id" , upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    const fruit = fruits.find((r) => r._id === id);

    if(!fruit){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const index = fruits.indexOf(recipe);
    fruits.splice(index, 1);
    res.send(fruit);
});

const validateFruit = (fruit) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        color: Joi.string().min(3).required(),
        family: Joi.string().min(3).required(),
        place: Joi.allow(""),
        growth: Joi.string().min(3).required(),
        image: Joi.string().allow(""),
       
    });

    return schema.validate(fruit);
};

app.listen(3000, () => {
    console.log("I'm Listening");
});
