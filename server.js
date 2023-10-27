const express=require("express");
const path=require("path");
const bodyParser=require("body-parser");
const controller=require("./controller/controller");

const app=express();

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine("html",require("ejs").renderFile);
app.set("view engine" ,"html");

app.get("/",(req,res)=>{
    res.render  ("index.html");
})
app.post("/login",(req,res)=>{
    controller.login(req,res);
})
app.get("/consumerdashboard",(req,res)=>{
    res.render("consumerDashboard.html")
})
app.post("/fetchUser",(req,res)=>{
    controller.fetchUser(req,res);
})
app.post("/fetchBills",(req,res)=>{
    controller.fetchBills(req,res);
})
app.post("/consumerUserinfo",(req,res)=>{
    controller.consumerUserinfo(req,res);
})
app.post('/saveUsers',(req,res)=>{
    controller.saveUsers(req,res);
})
app.get("/fetchSingleBill", (req, res) => {
    controller.fetchSingleBill(req, res);
});
app.post("/displayBill", (req, res) => {
    controller.displayBill(req, res);
    });
app.listen(3000,()=>{
    console.log("http://localhost:3000")
})