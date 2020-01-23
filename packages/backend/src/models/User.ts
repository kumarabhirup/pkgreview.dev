import * as mongoose from 'mongoose'

import database from '../utils/database'

export const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  githubUsername: { type: String, required: true, trim: true, unique: true },
  githubId: { type: Number, required: true, trim: true, unique: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: String, required: true, trim: true },
  updatedAt: { type: String, required: true, trim: true },
})

const userModel = database.model('User', userSchema)

export default userModel
