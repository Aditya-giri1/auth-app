const express = require("express");
const jwt  = require("jsonwebtoken");
const JWT_SECRET = "ADITYAGIRI10"; 

const app = express();
app.use(express.json());
const user = [];
function auth(req, res, next){
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        req.username = decoded.username;
        // If token is valid, proceed to the next middleware or route handlerf
        next();
    });
}

app.post("/signup", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    user.push({
        username: username,
        password: password
    })
    res.json({
        message: "User created successfully"
    });
});
app.post("/signin", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userFound = user.find(u => u.username === username && u.password === password);
    
    // Check if user exists and password matches
    if (userFound) {
        const token = jwt.sign({ username: userFound.username }, JWT_SECRET);
         res.header("Authorization", token);
        res.json({
            message: "Signin successful",
            token: token
            
        });
       
    } else {
        res.status(401).json({
            message: "Invalid credentials"
        });
    }
    
})
app.get("/protected", auth,function(req, res){
     
        res.json({
            message: "Protected data accessed",
            user: req.username
        });
    });
 
app.listen(3000, function(){
    console.log("Server started on port 3000");
});