const express =require("express");
const mongoose= require("mongoose");
const task = require("./module/task");
const app =express();



//midelwaer

app.use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));


// conect to mongogDB 
mongoose.connect("mongodb://127.0.0.1:27017/toDo").then(()=>{
    console.log("mongoDB conected")
}).catch(()=>{console.log("error")});



app.get("/", async(req,res)=>{
    const tasks = await task.find()
    res.render("todo",{tasks:tasks})

})


app.post("/new", (req,res)=> {
    try{
        const newTask = new task({
            title:req.body.title,
            desc:req.body.desc
        })
        newTask.save();

      res.redirect("/")

    }catch(err){
        res.status(500).send(err)
    }
})

app.post("/delete/:id" ,async(req,res)=>{
    try{
        const deletedTask = await task.findByIdAndDelete(req.params.id);
        if(!deletedTask ){
            return res.status(404).json({ message: "المهمة غير موجودة" })
        }
                res.redirect("/")
    }catch(err){
        console.error("خطأ في حذف المهمة:", err);
        res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
  

})


// التوجيه الى صفحة التعديل 
app.get("/edit/:id", async (req,res)=>{
    try{
        const oneTask = await task.findById(req.params.id);

        if(!oneTask){
            return res.status(404).send("المهمة غير موجودة");
        }

        res.render("edit",{Task: oneTask});

    }catch(err){
        console.error("خطأ في جلب المهمة:", err);
        res.status(500).send("حدث خطأ في الخادم");
    }
});



//  تعديل المهمه

app.post("/update/:id", async (req,res)=>{
    try{
        await task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                desc: req.body.desc
            }
        );

        res.redirect("/");
        
    }catch(err){
        console.error("خطأ في تعديل المهمة:", err);
        res.status(500).send("حدث خطأ في الخادم");
    }
});


app.post("/complete/:id", async (req,res)=>{
    try{
        const Task = await task.findById(req.params.id);

        if(!Task){
            return res.status(404).send("المهمة غير موجودة");
        }

        // يقلب الحالة
        Task.completed = !Task.completed;

        await Task.save();

        res.redirect("/");
        
    }catch(err){
        console.error(err);
        res.status(500).send("خطأ في السيرفر");
    }
});


app.listen(3142, ()=>{
    console.log("server is running in port 3142")
})