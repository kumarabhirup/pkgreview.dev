import './env'
import * as mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

const dbName = `pkgreview`
const connectionUrl = `mongodb+srv://${process.env.PR_MONGODB_USERNAME}:${process.env.PR_MONGODB_PASSWORD}@${process.env.PR_MONGODB_CLUSTER}-s4smj.mongodb.net/${dbName}?retryWrites=true&w=majority`

// Mongoose
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: false,
})

const db = mongoose.connection

// MongoDB
// eslint-disable-next-line import/no-mutable-exports
// let mongoDB: any

async function mongoDB(): Promise<any> {
  const client = await MongoClient.connect(connectionUrl, {
    useNewUrlParser: true,
  }).catch(err => {
    console.log(err)
  })

  if (!client) {
    return
  }

  try {
    const databse = client.db(dbName).admin()

    return databse
  } catch (err) {
    console.log(err)
  }
}

export { mongoDB }

export default db
