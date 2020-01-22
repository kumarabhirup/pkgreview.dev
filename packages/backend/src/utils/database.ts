import './env'
import * as mongoose from 'mongoose'

mongoose.connect(
  `mongodb+srv://${process.env.PR_MONGODB_USERNAME}:${process.env.PR_MONGODB_PASSWORD}@${process.env.PR_MONGODB_CLUSTER}.gcp.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
)

const db = mongoose.connection

export default db
