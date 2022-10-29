const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _=require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://minku-admin:Minkuadmin123@cluster0.svoxdma.mongodb.net/todolistDB", { useNewUrlParser: true });//to connect mongoDB

const itemsSchema = { //creating the schema for the items
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to the to-do-list"
});
const item2 = new Item({
    name: "Click + to add on a new item"
});mongod
const item3 = new Item({
    name: "<-- click here to delete an item"
});
const defaultItems = [item1, item2, item3]; //array of the items
const listSchema = { //schema for lists 
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    //     var today = new Date();
    //     var options = {
    //         weekday: "long",
    //         day: "numeric",
    //         month: "long"
    //     }
    //  let day=today.toLocaleDateString("en-US",options);
    // let day = date.getDate();
    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) { //insertinfg item to the db
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Done BITCH");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("LIST", { listTitle: "Today", newListItems: foundItems });
        }
    })
});
app.get("/:customFile", function (req, res) {
    const customFile = _.capitalize(req.params.customFile);
    List.findOne({ name: customFile }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customFile,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customFile);
            }
            else {
                res.render("LIST", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });

});


app.post("/", function (req, res) {
    var itemName = req.body.newItem;
    var listName = req.body.list;

    const item = new Item({
        name: itemName
    });
    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

});

app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItem, function (err) {
            if (!err) {
                // console.log("DONe");
                res.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItem } } }, 
            function(err, foundList) {
                if (!err) {
                    res.redirect("/" + listName);
                }
             })
    }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function (req, res) {
    console.log("SErver started");
});