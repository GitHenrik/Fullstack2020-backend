const mongoose = require('mongoose')

// course task 3.12
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.vttyr.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//saving a new person with 3 parameters
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save().then(response => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

//finding existing data with only password as a parameter
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}