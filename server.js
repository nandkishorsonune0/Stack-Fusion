const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://nandkishor:nandkishor@cluster0.dndtbxs.mongodb.net/formDB', {useNewUrlParser: true, useUnifiedTopology: true })

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    methods: ['POST'],
    credentials: true
}))

// Collection Schema
const formSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please check your data entry, no name specified']
    },
    email: {
        type: String,
        required: [true, 'Please check your data entry, no email specified']
    },
    phoneNum: {
        type: String,
        required: [true, 'Please check your data entry, no number specified']
    },
    dob: {
        type: String,
        required: [true, 'Please check your data entry, no dob specified']
    },
})

// Collection Model
const Form = mongoose.model('form', formSchema)


app.get('/', function(req, res){
    res.status(200).send("Hello world!")
})

app.post('/save-data', function(req, res){
    
    const firstName = req.body.firstName
    const email = req.body.email
    const phoneNum = req.body.phoneNumber
    const dob = req.body.dob

    //Save to data in DB
    const formData = Form({
        firstName : firstName,
        email : email,
        phoneNum : phoneNum,
        dob : dob,
    })

    formData.save(function(error){
        if(error){
            console.log(error)
            //In case of error, send to client
            res.status(500)
        }else{
            console.log('Form data saved')
        }
    })

    
    //Send confirmation email after data is saved to DB
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nandkishorsonune0@gmail.com',
            pass: "rycpjljlcptetsnx"
        }
    });

    const mailOptions = {
        form: 'nandkishorsonune0@gmail.com',
        to: email,
        subject: 'StackFusion User-Form Confirmation',
        text: `Form data submited :

            First Name: ${firstName},
            Email: ${email},
            Phone Number: ${phoneNum},
            DoB: ${dob}
        `
    };

    transporter.sendMail(mailOptions, function(err, info){
        
        if(err){
            console.log(err);
        }else{
            console.log(info);
            console.log("Successfully submitted form.");
        }
    });

    res.status(200).json({message : "Form data saved and confirmation email sent."})
})

// Read all forms
app.get('/read-forms', function(req, res){

    Form.find(function(error, foundForms){
        if(error){
            console.log(error)
            res.status(500)
        }else{
            console.log(foundForms)
            res.status(200).send(foundForms)
        }
    })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, function(){
    console.log(`Server up and running on PORT : ${port}`)
})