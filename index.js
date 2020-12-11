// FullStack-course 2020, tasks 3.1-3.18*, Henrik Tarnanen
// task 3.12 in file mongo.js

// TODO: tasks 3.17, 3.18

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
//require dotenv before Person, as the variables are needed there
require('dotenv').config()
const Person = require('./models/person')

//required json-parser to access the body element of requests
app.use(express.static('build'))
app.use(express.json())
app.use(cors())


// morgan-middleware is used to log requests. POST-requests are logged more in-depth

morgan.token(morgan.token('new', (req, res) => {
  if (req.method === 'POST') {

    return JSON.stringify(req.body)
  }
  return ""
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :new'))



let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

// const randomId = () => {
//   return Math.floor(Math.random() * 99999)
// }

app.put('/api/persons/:id', (req, res, next) => {
  const reqBody = req.body
  // error handling
  if (!reqBody.name) {
    return res.status(400).json({
      error: 'Name is missing'
    })
  }
  if (!reqBody.number) {
    return res.status(400).json({
      error: 'Number is missing'
    })
  }
  //create a new person object to update existing data
  const newPerson = {
    "name": reqBody.name,
    "number": reqBody.number,
  }

  //perform the put request to update the person by ID
  Person.findByIdAndUpdate(req.params.id, newPerson)
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const reqBody = req.body
  // error handling
  if (!reqBody.name) {
    return res.status(400).json({
      error: 'Name is missing'
    })
  }
  if (!reqBody.number) {
    return res.status(400).json({
      error: 'Number is missing'
    })
  }
  //  --------this section is commented out regarding task 3.13-3.14
  // if (persons.find(person => person.name === reqBody.name)) {
  //   return res.status(400).json({
  //     error: 'Name already in use'
  //   })
  // } --------------


  //const id = randomId()

  //console.log(req.headers)
  //console.log(req.body)
  const newPerson = new Person({
    "name": reqBody.name,
    "number": reqBody.number,
    //"id": id
  })
  //persons = persons.concat(newPerson)
  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))

})


app.get('/api/persons', (req, res, next) => {
  //res.send(persons)
  Person.find({}).then(mongoPersons => {
    res.json(mongoPersons)
  })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(people => {
      res.send(`<div>Phonebook has info on ${people.length} people</div>
      <div>${new Date()}</div>`)
    })
    .catch(error => next(error))
  // res.send(`<div> Phonebook has info on ${persons.length} people</div>
  // <div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (req, res, next) => {
  //const id = Number(req.params.id)
  // //console.log("id ", id, " of type ", typeof id)
  // //if the id doesn't match, send http 404
  // // if (!persons[id]) {
  // //   res.status(404).end()
  // // }
  // // res.json(persons[id])
  // const person = persons.find(person => person.id === id)
  // if (person) {
  //   //console.log("match")
  //   res.json(person)
  // }

  // else {
  //   //console.log("no match")
  //   res.status(404).end()
  // }
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => {
      next(error)
      // console.log("GET failed: ", error.message)
      // res.status(400).send({ error: 'Malformatted ID' })
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // persons = persons.filter(person => person.id !== id)
  // res.status(204).end()
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})

//error handling start (task 3.16)
const errorHandler = (error, req, res, next) => {
  console.log("Error name is ", error.name)
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted ID' })
  }
  next(error)
}
app.use(errorHandler)
//error handling end

//unknown endpoint start
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)
//unknown endpoint end