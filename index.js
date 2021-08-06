const express = require('express')
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const { name } = require('ejs');
const bcrypt = require('bcrypt');
const bodyParser =  require('body-parser')
const { response } = require('express');
const multer = require('multer');
const fs = require('fs');
const saltRounds = 10;


//const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.json());
app.set("view engine","ejs");

const db = mysql.createConnection({
    user : 'root',
    host : 'localhost',
    password: '',
    database: 'eut_furniture',
    multipleStatements:true
});

// app.post('/login',(req,res)=>{
//   const email = req.body.email;
//   const password = req.body.password;
   
//   db.query(
//       "SELECT * FROM employee WHERE email=?;",
//       email,
//       (err,result)=>{
//           if(err)
//           { 
//               res.send({err:err})
//           } 
//           if(result.length > 0){
//               bcrypt.compare(password, result[0].password,(error,response)=>{
//                 if(response){
//                   res.send(result)
//                 } else{
//                   res.send({message:'Username or password incorrect'});
//                 }
//               })
//           } else{
//                res.send({message:"User Doesn't Exist"});
//              }
//           }
         
//       )
//   })




app.post('/register',(req,res)=>{
    
    const name = req.body.name;
    const NIC = req.body.NIC;
    const email = req.body.email;
    const phone_no = req.body.phone_no;
    const job_start_date = req.body.job_start_date;
    const confirm_password = req.body.confirm_password;
    const address = req.body.address;
    const role = req.body.role;
    const password = req.body.password;
   
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        
      if(err){
          console.log(err);
      }

    db.query("INSERT INTO employee (name,NIC,email,phone_no,job_start_date,confirm_password,address,role,password) VALUES (?,?,?,?,?,?,?,?,?)",
    [name,NIC,email,phone_no,job_start_date,hash,address,role,hash],(err,result)=>{
       
            console.log(err);
       if(result){
         res.send({message:"Successfully added"});
       }
      })
    
    })
    
});

app.post('/adddeliver',(req,res)=>{
    
  const name = req.body.name;
  const NIC = req.body.NIC;
  const email = req.body.email;
  const phone_no = req.body.phone_no;
  const job_start_date = req.body.job_start_date;
  const confirm_password = req.body.confirm_password;
  const address = req.body.address;
  const role = req.body.role;
  const password = req.body.password;
 
  bcrypt.hash(password,saltRounds,(err,hash)=>{
      
    if(err){
        console.log(err);
    }

  db.query("INSERT INTO employee (name,NIC,email,phone_no,job_start_date,confirm_password,address,role,password) VALUES (?,?,?,?,?,?,?,?,?)",
  [name,NIC,email,phone_no,job_start_date,hash,address,role,hash],(err,result)=>{
     
          console.log(err);
     if(result){
       res.send({message:"Successfully added"});
     }
    })
  
  })
  
});

app.post('/login',(req,res)=>{
  
  const email = req.body.email;
  const password = req.body.password;
  console.log(email)
  console.log(password)
  db.query(
      "SELECT *FROM employee WHERE email=?;",
     email,
      (err,result)=>{
          if(err)
          { 
              res.send({err:err})
          } 
          if(result){
          if(result.length > 0){
            bcrypt.compare(password,result[0].password,(error, response) =>{
                if(response){
                 res.send(result);
                }
                else{
                 res.send({message:"Invalid Username or Password"});
                }
            })
         }
         else{
             res.send({message:"Invalid Username or Password"});
         }
     }
    }
 );
});


app.post('/AddCategory',(req,res)=>{
  console.log(req.body)
  const name = req.body.name;
  const date = req.body.date;
  
 
 
  db.query("INSERT INTO category (name,date) VALUES (?,?)",
  [name,date],(err,result)=>{
      if(err){
          console.log(err);
      } else{
          res.send("values inserted");
      }
  
  })
  
});

app.get('/load',(req,res)=>{
    db.query('SELECT * FROM employee ',(err,result,fields)=>{
        if(!err)
        res.send(result);
        else
        console.log(err);
    })
})

app.get('/loadCategory',(req,res)=>{
  db.query('SELECT * FROM category ',(err,result,fields)=>{
      if(!err)
      res.send(result);
      else
      console.log(err);
  })
})

app.get('/loadProduct',(req,res)=>{
  db.query('SELECT * FROM products ;',(err,results,fields)=>{
     if(err) throw err;
     res.send(results);
  })
})

app.get('/loadGift',(req,res)=>{
  db.query('SELECT * FROM gift ;',(err,results,fields)=>{
     if(err) throw err;
     res.send(results);
  })
})

app.get('/loadCategoryType',(req,res)=>{
  db.query('SELECT category_id,name FROM category ;',(err,results,fields)=>{
     if(err) throw err;
     res.send(results);
  })
})


app.get('/loadCustomizedOrder',(req,res)=>{
  db.query("SELECT customized_products.cus_product_id,customized_products.product_name,customized_products.price,customized_products.delivery_date,customer.name FROM customized_products INNER JOIN customer ON customized_products.customer_id=customer.customer_id ",(err,result,fields)=>{
    if(!err)
    res.send(result);
    else
    console.log(err);
  })
})

app.get('/loadPayment',(req,res)=>{
  db.query("SELECT payment.payment_id,payment.payment_method,payment.payment_status,product.product_name,orders.advance_price,orders.total_price,orders.order_id FROM ((payment INNER JOIN product ON payment.product_id=product.product_id) INNER JOIN orders ON payment.order_id=orders.order_id) ",(err,result,fields)=>{
    if(!err)
    res.send(result);
    else
    console.log(err);
  })
})



app.get('/loadCustomer',(req,res)=>{
  db.query('SELECT customer_id, name,email,address,phone_no,points,order_frequency FROM customer',(err,rows,fields)=>{
      if(!err)
      res.send(rows);
      else
      console.log(err);
  })
})

app.get("/employeesLoad/:id", (req, res) => {
    db.query("SELECT * FROM employee WHERE id=?", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

  app.get('/employees',(req,res) => {
    db.query('SELECT * FROM employee', (err, result) => {
        if(err) {
            console.log(err)
        }else {
            res.send(result);
        }
    });
});

  // app.put("/update", (req, res) => {
  //   const id = req.body.id;
   
  //   db.query(
  //     "UPDATE employee SET name = ?, NIC=?, email=?, role=?, address=?, job_start_date=?, phone_no=? WHERE id = ?",
  //     [name,NIC,email,role,address,job_start_date,phone_no],
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.send(result);
  //       }
  //     }
  //   );
  // });

  //delete 
  app.delete("/delete/:id",(req,res)=>{
    const id = req.params.id;
    const sqlDelete="DELETE FROM employee WHERE id=?";

    db.query(sqlDelete,id,(err,result)=>{
      if(err) console.log(err);
    });
  });

  app.get('/loadEmp/:id',(req,res)=>{
    const id = req.params.id;
    db.query('SELECT * FROM employee WHERE id=?',(err,result)=>{
      if(!err)
      res.send(result);
      else
      console.log(err);
    })
})

  app.delete("/deleteCategory/:category_id",(req,res)=>{
    const category_id = req.params.category_id;
    const sqlDelete="DELETE FROM category WHERE category_id=?";

    db.query(sqlDelete,category_id,(err,result)=>{
      if(err) console.log(err);
    
    });
  });

  //view details
  app.get("/view",(req,res)=>{
    id=req.params.id;
    db.query("SELECT * FROM employee WHERE id=?",[req.query.id],(err,result)=>{
      console.log(req.query.id);
      res.send(result);
    });
    
  });

//update
app.put("/update/:id",(req,res)=>{
  const id = req.params.id;
  const name = req.params.name;
  const sqlUpdate="UPDATE employee SET name=? WHERE id=?";

  db.query(sqlUpdate,[name,id],(err,result)=>{
    if(err) console.log(err);
  })
});

app.put('/updateEmployee/:id', (req,res) => {
  console.log(id);
  //const id = req.body.id;
  const name = req.body.name;
  const sqlUpdate = "UPDATE SET employee name=? WHERE id=?";

  db.query(sqlUpdate,[name,id],(err,result)=>{
    if(err) console.log(err);
  })
});

//show a single record
app.get("/viewEmp",(req,res)=>{
    db.query( "SELECT *FROM employee WHERE id=?",[req.params.id],(err,rows,fields)=>
   {
        if(!err)
        res.send(rows);
        else
        console.log(err);
   })
});


app.get('/edit/:id',(req, res) => {
  const id = req.params.userId;
  let sql = `Select * from employee where id = ${id}`;
  let query = connection.query(sql,(err, result) => {
      if(err) throw err;
      res.render('user_edit', {
          title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
          user : result[0]
      });
  });
});

app.post('/update',(req, res) => {
  const userId = req.body.id;
  let sql = "update employee SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+id;
  let query = connection.query(sql,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

const storage = multer.diskStorage({
  destination(req,file,cb){
    cb(null,'../client/public/')
  },
  filename(req,file,cb){
    cb(
      null,
      `${file.originalname.split('.')[0]}.jpg`
    )
  }
})

const upload = multer({
  storage,
  limits:{
    fileSize: 5000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpeg|jpg|png)$/i)){
      return  cb(new Error('pleaseupload image with type of jpg or jpeg'))
  }
  cb(undefined,true)
}
})

app.post("/imageUpload",upload.single('file'),(req,res)=> {
   
})

app.post('/addProducts',(req,res)=>{
  
  console.log(req.body)
const product_img =req.body.image;
const name = req.body.name;
const price = req.body.price;
const material = req.body.material;
const quantity = req.body.quantity;
const category_id=req.body.category_id;

db.query(
  "INSERT INTO products(name,price,product_img,material,quantity,category_id) VALUES (?,?,?,?,?,?)",[name,price,product_img,material,quantity,category_id],
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send("Values added")
    }
  }
);
})

app.post('/addGift',(req,res)=>{
  
  console.log(req.body)
const gift_img =req.body.image;
const name = req.body.name;
const price = req.body.price;
const quantity = req.body.quantity;

db.query(
  "INSERT INTO gift(gift_img,name,price,quantity) VALUES (?,?,?,?)",[gift_img,name,price,quantity],
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send("Values added")
    }
  }
);
})



app.listen(3001,()=>{
    console.log("Your server is running on port 3001");
});