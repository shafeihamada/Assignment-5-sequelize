const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

router.post('/', async (req, res) => {
    try {
        const { comments } = req.body;

        if (!comments || !Array.isArray(comments)) {
            return res.status(400).json({ message: "الرجاء إرسال مصفوفة من التعليقات" });
        }

        await Comment.bulkCreate(comments);

        return res.status(201).json({
            messaeg: "comments created."
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.patch('/:commentId', async (req, res) => { 
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body; 

        
        const idInput = parseInt(commentId);
        if (isNaN(idInput)) {
            return res.status(400).json({ message: "Invalid comment ID format." });
        }

    
        const comment = await Comment.findByPk(idInput);

        
        if (!comment) {
            return res.status(404).json({
                message: "comment not found."
            });
        }

    
        if (parseInt(comment.userId) !== parseInt(userId)) {
            return res.status(403).json({
                message: "You are not authorized to update this comment."
            });
        }

       
        comment.content = content;
        await comment.save();

        return res.status(200).json({
            message: "Comment updated."
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.post('/find-or-create', async (req, res) => { 
    try {
        const { postId, userId, content } = req.body;

    
        const [comment, created] = await Comment.findOrCreate({
            where: { 
                postId: parseInt(postId), 
                userId: parseInt(userId), 
                content: content 
            },
            defaults: {
                postId: parseInt(postId),
                userId: parseInt(userId),
                content: content
            }
        });

    
        return res.status(200).json({
            comment: comment,
            created: created 
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



const { Op } = require('sequelize');


router.get('/search', async (req, res) => {
    try {
        const { word } = req.query; 

        
        if (!word) {
            return res.status(200).json({ count: 0, comments: [] });
        }


        const { count, rows } = await Comment.findAndCountAll({
            where: {
                content: {
                    [Op.like]:`%${word}% ` 
                }
            }
        });

    
        if (count === 0) {
            return res.status(200).json({
                message: "no comments found." 
            });
        }

        
        return res.status(200).json({
            count: count,
            comments: rows
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.get('/newest/:postId', async (req, res) => {
    try {
        const { postId } = req.params; 

       
        const comments = await Comment.findAll({
            where: {
                postId: parseInt(postId)
            },
            order: [
                ['createdAt', 'DESC'] 
            ],
            limit: 3 
        });

    
        return res.status(200).json(comments);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});







router.get('/details/:id', async (req, res) => {
    try {
        const { id } = req.params; 

    
        const comment = await Comment.findByPk(parseInt(id), {
            include: [
                {
                    model: User,
                    
                },
                {
                    model: Post,
                    
                }
            ]
        });

      
        if (!comment) {
            return res.status(404).json({
                message: "no comment found" 
            });
        }

       
        return res.status(200).json(comment);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;