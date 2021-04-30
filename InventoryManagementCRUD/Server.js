const express=require('express')
const app=express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var jquery=require("jquery")
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Footwear',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('Footwear')
    app.listen(8000,()=>{
        console.log("listening at port number 8000")
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Stock details or Home Page
app.get('/',(req,res)=>{
    db.collection('footwear').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('stock_details.ejs',{stock: result})
    })
})

//add product page
app.get('/create',(req,res)=>{
        res.render('add.ejs')
})
 

//delete product page
app.get("/deleteproduct",(req,res)=>{
    db.collection("footwear").find({pid:req.query.pid}).toArray((err,result)=>{
        if(err) return console.log(err);
        res.render("delete.ejs",{data:result});
    });
    
}); 

//add new product to collection
app.post('/AddData',(req,res)=>{
    db.collection('footwear').save(req.body,(err,result)=>{
        if(err)
             return console.log(err)
        console.log('New Product Added');
        res.redirect('/')
    })  
})

//show stock update page
app.get("/updatestock",(req,res)=>{
    db.collection("footwear").find({pid:req.query.pid}).toArray((err,result)=>{
        if(err) return console.log(err);
        res.render("update.ejs",{data:result});
    });
    
});
//updatestock(post)
app.post('/update',(req,res)=>{
    var edited=parseInt(req.body.stock);
    var edited1=parseInt(req.body.cp);
    var edited2=parseInt(req.body.sp);
    db.collection("footwear").findOneAndUpdate({pid:req.body.id},{
        $set:{stock: edited,cp:edited1,sp:edited2}},{sort: {_id:-1}},
        (err,result)=>{
            if(err) return console.log(error);
            console.log(req.body.id+" stock edited");
            res.redirect("/");
    });
});
//delete product
app.post('/delete',(req,res)=>{
    db.collection('footwear').findOneAndDelete({pid : req.body.id},(err,result)=>{
        if(err)
             return console.log(err)
        console.log(req.body.id+'Product Deleted')
        res.redirect('/')
    })  
}) 
app.post('/cancel',(req,res)=>{
        res.redirect('/')
    })
app.get('/printstock',(req,res)=>{
        db.collection('footwear').find().toArray((err,result)=>{
            if(err) return console.log(err);
            res.render('stock-print.ejs',{stock: result})
        })
    }) 
    app.get('/sales',(req,res)=>{
        res.render("sales.ejs")
    })


