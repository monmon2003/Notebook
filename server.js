const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
app.options('*', cors())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Type,Accept");
    next();
});
// app.use(cors({origin:"*"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
main().catch(err => console.log(err));
async function main(){
    await mongoose.connect(process.env.URL);
}
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Note = new mongoose.model("Note",noteSchema);
app.route("/notes")
.get(function(req,res){
    Note.find()
    .then(function (result) {
        res.send(result);
      })
      .catch(function (err) {
        res.send(err);
      });
    
    
})
.post(function(req,res){
    const newNote = new Note({
        title:req.body.title,
        content:req.body.content
    });
    newNote.save()
    .then(result => {
        console.log(result);
        res.send(result);
    })
    .catch(err =>{
        res.send(err);
    });
});
app.delete("/notes/:noteId",function(req,res){
    const noteId = req.params.noteId;
    Note.findByIdAndDelete(noteId)
    .then(res.send("Deleted Item Successfully"))
    .catch(err => {
        res.send(err);
    })
});
app.listen(PORT,function(){
    console.log("Server started on port " + PORT);
})
