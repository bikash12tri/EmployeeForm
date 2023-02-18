const express = require("express")
const router = express.Router()

const {createEmployee, login, getEmployee, updateEmployee, deleteEmployee} = require('../controllers/employeeController')
const {authentication, authorization} = require('../middlewares/auth')

router.post('/createEmployee', createEmployee)
router.post('/login', login)
router.get('/getEmployee/:userId',authentication, getEmployee)
router.put('/updateEmployee/:userId', authentication, authorization, updateEmployee)
router.delete('/deleteEmployee/:userId', authentication, authorization, deleteEmployee)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router