const express = require('express');
const router = express.Router();


const User = require('../models/user'); 
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        
        const newUser = User.build({ name, email, password, role });
        await newUser.save();

        
        return res.status(201).json({ message: "User added successfully" });

    } catch (error) {
      
        return res.status(400).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

       
        await User.upsert(
            { id: id, name, email, password, role },
            { 
                validate: false,
                fields: ['name', 'email', 'password', 'role']
            }
        );

        return res.status(200).json({ message: "User created or updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



router.get('/by-email', async (req, res) => {
    try {
        
        const { email } = req.query; 

        
        const user = await User.findOne({ where: { email } });

        
        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }

        
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

       
        const user = await User.findByPk(id, {
            attributes: { exclude: ['role'] } 
        });


        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;