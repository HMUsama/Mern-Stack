const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

//router is mini application

// user Model 
const User = require('../../model/User');

//@route GET api/users
//@desc register New user
//@access Public

router.post('/', (req,res)=>{
    const {name,email,password} = req.body;

    //Simple validation
    if(!name || !email || !password){
        return res.status(400).json({msg:'Please Enter All Feilds'})
    }
    //check for existing user
    User.findOne({email})
    .then(user=>{
        if(user) return res.status(400).json({msg:'User already exists'})

        const newUser = new User({
            name,
            email,
            password,
        });

        //Create salt & hash
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err; 
                newUser.password = hash;
                newUser.save()
                .then(user=>{
                    res.json({
                        user:{
                            id:user.id,
                            name:user.name,
                            email:user.email
                        }
                    })
                });
            })
        })
    })
});

module.exports = router;