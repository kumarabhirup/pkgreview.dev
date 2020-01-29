import './env'
import * as mongoose from 'mongoose'

mongoose.connect(
  `mongodb+srv://${process.env.PR_MONGODB_USERNAME}:${process.env.PR_MONGODB_PASSWORD}@${process.env.PR_MONGODB_CLUSTER}-s4smj.mongodb.net/pkgreview?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false , useUnifiedTopology: false }
)

const db = mongoose.connection

export default db
