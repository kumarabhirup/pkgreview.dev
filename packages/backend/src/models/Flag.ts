import * as mongoose from 'mongoose'

import database from '../utils/database'

export const flagSchema = new mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
  createdAt: { type: String, required: true, trim: true },
  updatedAt: { type: String, required: true, trim: true },
})

const flagModel = database.model('Flag', flagSchema)

export default flagModel
