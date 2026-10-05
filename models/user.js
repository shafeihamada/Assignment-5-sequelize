const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');   

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true 
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            checkPasswordLength(value) { 
                if (value.length <= 6) {
                    throw new Error('Password length must be greater than 6 characters.');
                }
            }
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: (user) => { 
            if (user.name && user.name.length <= 2) {
                throw new Error('Name must be greater than 2 characters.');
            }
        }
    }
});

module.exports = User;