const mongoose =require("mongoose")

const TaskSchema= new mongoose.Schema({
    title :{
        type: String,
        required: true,
        trim:true
    },
    desc:{
        type:String,
        trim:true

    },
    completed:{
        type:Boolean,
        default: false,
        trim:true

    },
      createdAt: {  
        type: Date,
        default: Date.now
    }
})


module.exports= mongoose.model("task",TaskSchema);