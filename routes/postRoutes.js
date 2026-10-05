const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');
const { sequelize } = require('../models'); 


router.post('/', async (req, res) => {
    try {
        const { title, content, userId } = req.body;

      
        const post = Post.build({ title, content, userId });
        await post.save();

        return res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});


router.delete('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body; 
        const post = await Post.findByPk(postId);

        // أ) إذا لم يتم العثور على المنشور
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

       
        if (post.userId !== parseInt(userId)) {
            return res.status(403).json({ message: "We are not authorized to delete this post." });
        }

        
        await post.destroy();

        return res.status(200).json({ message: "Post deleted." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.get('/details', async (req, res) => {
    try {
        const posts = await Post.findAll({
           
            attributes: ['id', 'title'], 
            include: [
                {
                    model: User,
                    
                    attributes: ['id', 'name'] 
                },
                {
                    model: Comment,
                    
                    attributes: ['id', 'content'] 
                }
            ]
        });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.get('/comment-count', async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'title',
               
                [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount']
            ],
            include: [
                {
                    model: Comment,
                    attributes: [] 
                }
            ],
            group: ['Post.id'] 
        });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
