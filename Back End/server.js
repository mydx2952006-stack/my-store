const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "data");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
function read(file){ return JSON.parse(fs.readFileSync(path.join(DATA,file),"utf8")); }
function write(file,data){ fs.writeFileSync(path.join(DATA,file),JSON.stringify(data,null,2)); }
app.get("/api/products",(req,res)=>res.json(read("products.json")));
app.get("/api/orders",(req,res)=>res.json(read("orders.json")));
app.post("/api/orders",(req,res)=>{
 const {name,phone,address,city,items,total}=req.body;
 if(!name||!phone||!address||!Array.isArray(items)||!items.length) return res.status(400).json({error:"Missing order data"});
 const orders=read("orders.json");
 const order={id:Date.now(),name,phone,address,city:city||"",items,total:Number(total)||0,status:"New",createdAt:new Date().toISOString()};
 orders.unshift(order); write("orders.json",orders);
 res.status(201).json({message:"Order saved",orderId:order.id});
});
app.patch("/api/orders/:id",(req,res)=>{
 const orders=read("orders.json"); const order=orders.find(o=>String(o.id)===req.params.id);
 if(!order) return res.status(404).json({error:"Not found"});
 order.status=req.body.status||order.status; write("orders.json",orders); res.json(order);
});
app.get("/admin",(req,res)=>res.sendFile(path.join(__dirname,"admin.html")));
app.listen(PORT,()=>console.log(`El Mahdy Store running at http://localhost:${PORT}`));
