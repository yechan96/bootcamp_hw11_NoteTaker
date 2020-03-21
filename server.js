const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 80;

const publicPath = path.resolve(__dirname,"public");
const dbPath = path.resolve(__dirname,"db");

app.use(express.urlencoded({extended:true}));
app.use(express.static(publicPath));
app.use(express.json());


app.get("/notes", function(req, res){
    res.sendFile(path.join(publicPath,"notes.html"));
});


app.get("/api/notes",function(req,res){
    let rawdata = fs.readFileSync(path.join(dbPath,"db.json"));
    let data = JSON.parse(rawdata);
    return res.json(data);
});

app.post("/api/notes",function(req,res){
    let rawdata = fs.readFileSync(path.join(dbPath,"db.json"));
    let data = JSON.parse(rawdata);

    let newNotes = req.body;
    let stringid = newNotes.title.replace(/\s+/g, "").toLowerCase();
    newNotes.id = stringid + Math.floor(Math.random()*1000).toString();
    data.push(newNotes);

    updateJSON(data);
    return res.json(newNotes);
});

app.delete("/api/notes/:id",function(req,res){
    let rawdata = fs.readFileSync(path.join(dbPath,"db.json"));
    let data = JSON.parse(rawdata);

    let chosenID = req.params.id;
    let removeIndex = data.map(function(note){return note.id;}).indexOf(chosenID);
    if (removeIndex !=null){
        data.splice(removeIndex,1);
        updateJSON(data);
        return res.json(true);
    }
    return res.json(false);
});


app.get("*", function(req, res){
    res.sendFile(path.join(publicPath,"index.html"));
});

const updateJSON = function(data){
    fs.writeFileSync(path.join(dbPath,"db.json"),JSON.stringify(data));
};


app.listen(PORT, function(){
    console.log("App listening on PORT"+PORT);
});