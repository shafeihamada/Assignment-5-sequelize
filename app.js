const express = require('express');
const {sequelize} = require('./models');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes.js');

const app = express();


app.use(express.json());
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);


const PORT = 3000;
sequelize.sync({ force: false }).then(()=>{
        console.log('Database connected & synced successfully! 🚀');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });