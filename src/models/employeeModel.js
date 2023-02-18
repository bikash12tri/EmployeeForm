const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: String,
        required: true
    },
    doj: {
        type: String,
        required: true  
    },
    experience: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: String,
        default: new Date().toLocaleString()
    },
    updatedAt: {
        type: String,
        default: null
    },
    deletedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Employee', employeeSchema)