// const mongoose = require('mongoose')

// if (process.argv.length<[3]) {
//     console.log("Give password as an argument")
//     process.exit(1)
// }

// const password = process.argv[2]

// const url = `mongodb+srv://Spoonbadger:${password}@cluster0.qiupe.mongodb.net/phonebookApp?
// retryWrites=true&w=majority&appName=Cluster0`


// mongoose.set('strictQuery', false)

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// })

// const Person = mongoose.model('Person', noteSchema)

// if (process.argv.length === 3) {
//     console.log("phonebook:")
//     Person.find ({}).then(result => {
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//     })
// }
// else {
//     const personName = process.argv[3]
//     const personNumber = process.argv[4]

//     const person = new Person({
//         name: personName,
//         number: personNumber,
//     })

//     person.save().then(result => {
//         console.log(`added ${personName} number ${personNumber} to phonebook`)
//         mongoose.connection.close()
//     })
// }