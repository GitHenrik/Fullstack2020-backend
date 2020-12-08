const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//required json-parser to access the body element of requests
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// morgan-middleware is used to log requests. POST-requests are logged more in-depth

morgan.token(morgan.token('new', (req, res) => {
  if (req.method === 'POST') {

    return JSON.stringify(req.body)
  }
  return ""
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :new'))

// FullStack-course 2020, tasks 3.1-3.8*, 3.9-3.11, Henrik Tarnanen
// task 3.12 in file mongo.js
//delete hasn't yet got special case treatment
//https://polar-tundra-38946.herokuapp.com/api/persons
//heroku logs -t

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



app.post('/api/persons', (req, res) => {
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
  if (persons.find(person => person.name === reqBody.name)) {
    return res.status(400).json({
      error: 'Name already in use'
    })
  }


  const id = randomId()

  //console.log(req.headers)
  //console.log(req.body)
  const personBody = {
    "name": reqBody.name,
    "number": reqBody.number,
    "id": id
  }
  persons = persons.concat(personBody)
  res.json(personBody)
})

const randomId = () => {
  return Math.floor(Math.random() * 99999)
}

app.get('/api/persons', (req, res) => {
  //res.send(persons)
  Person.find({}).then(mongoPersons => {
    res.send(mongoPersons)
  })
})

app.get('/info', (req, res) => {
  res.send(`<div> Phonebook has info on ${persons.length} people</div>
  <div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  //console.log("id ", id, " of type ", typeof id)
  //if the id doesn't match, send http 404
  // if (!persons[id]) {
  //   res.status(404).end()
  // }
  // res.json(persons[id])
  const person = persons.find(person => person.id === id)
  if (person) {
    //console.log("match")
    res.json(person)
  }

  else {
    //console.log("no match")
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening ${PORT}.`)
})