const mongoose = require('mongoose')

// POISTA ENNEN  PUSHAUSTA OSOITTEET JA SALASANAT YMS
//const password = process.argv[2]
//const url = `mongodb+srv://fullstack:${password}@cluster0.vttyr.mongodb.net/phonebook?retryWrites=true`
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB: ", error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)