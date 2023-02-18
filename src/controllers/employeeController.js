const employeeModel = require('../models/employeeModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    createEmployee : async (req, res) => {
        try {
            let {phone, email, password} = req.body
            let uniqueData = await employeeModel.find({ $and: [{ $or: [{ phone: phone }, { email: email }] }, { isDeleted: false }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })

            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }

            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            req.body.password = encryptedPassword

            let saveData = await employeeModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login : async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await employeeModel.findOne({ email: email, isDeleted: false});

            if (!findUser) {
                return res.status(404).send({ status: false, message: "User not found" });
            }

        //****  comparing hashed password and login password *******

            const isPasswordMatching = await bcrypt.compare(password, findUser.password);
            if (!isPasswordMatching) {
                return res.status(404).send({ status: false, message: "Either emailId or password is incorrect" })
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key")        
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    getEmployee : async (req, res) => {
        try {
            let {userId} = req.params
            let findData = await employeeModel.findOne({_id: userId, isDeleted: false})
            if (!findData) {
                return res.status(404).send({status: false, msg: 'Data not found' })
            }
            return res.status(200).send({status: true, Employee: findData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateEmployee : async (req, res) => {
        try {
            let {userId} = req.params
            let data = req.body
            let {phone, email, password} = data
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            let uniqueData = await employeeModel.find({ $and: [{ $or: [{ phone: phone }, { email: email }] }, { isDeleted: false }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })
    
            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }

            if (password) {
                let salt = await bcrypt.genSalt(10);
                let encryptedPassword = await bcrypt.hash(password, salt);
                req.body.password = encryptedPassword
            }
            data['updatedAt'] = new Date().toLocaleString()
            let updateData = await employeeModel.findOneAndUpdate({_id: userId, isDeleted: false},data,{new: true})
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(400).send({ status: false, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    deleteEmployee : async (req, res) => {
        try {
            let userId = req.params.userId
            let deleteData = await employeeModel.findOneAndUpdate({_id: userId, isDeleted: false},{isDeleted: true, deletedAt: new Date().toLocaleString()})
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(400).send({ status: false, msg: 'User deleted successfully'})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}