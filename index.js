const express = require("express");
const mongoose = require('mongoose');
const app = express();
const port = 3020;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//create product schema
const productSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required : true
    },
    description :{
        type: String,
        required : true
    },
    createAt : {
        type : Date,
        default : Date.now
    }
})
//create product models
const product = mongoose.model("products",productSchema);

app.post("/products",async(req,res)=>{
    try {
        const newProduct = new product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description
        })
        const productData = await newProduct.save();
        res.status(201).send(productData);
    } catch (error) {
        res.status(500).send({message : error.message})
    }
})
//all products 
app.get("/products", async (req,res) =>{
    try {
        const allProducts = await product.find()
        res.status(200).send({data : allProducts});
    } catch (error) {
        res.status(404).send({message: error.message})
    }
})
//specific product find
app.get("/products/:id", async (req,res) =>{
    try {
        const id = req.params.id;
        const singleProduct = await product.findOne({_id : id},{title: 1, _id: 0});
        res.status(200).send(singleProduct)
        // res.status(200).send({
        //     success : true,
        //     data : singleProduct
        // });
    } catch (error) {
        res.status(404).send(`products not found`)
    }
})

//delete product
app.delete("/products/:id", async (req,res) =>{
    try {
        const id = req.params.id;
        // const deleteProduct = await product.deleteOne({_id : id})
        const deleteProduct = await product.findByIdAndDelete({_id : id})
        res.status(200).send({
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        res.status(404).send(`not found`);
    }
})
//update product
app.put("/products/:id", async (req,res) =>{
    try {
        const id = req.params.id;
        // const deleteProduct = await product.deleteOne({_id : id})
        const updateProduct = await product.findByIdAndUpdate(
            {_id : id},
            {$set : 
                {
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description
                }
            },
            {new : true}
            )
        res.status(200).send({
            success : true,
            data : updateProduct
        })
    } catch (error) {
        res.status(404).send(`not found`);
    }
})


const dbconnection = async() =>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log(`database is connected`);
    }catch(error){
        console.log(`database is not connected`);
        console.log(error);
        process.exit(1)
    }
}
    

app.get("/", (req, res) => {
    res.send("this is home route");
})

app.listen(port, async() => {
    console.log(`Server is running at http://localhost:${port}`);
    await dbconnection();
})