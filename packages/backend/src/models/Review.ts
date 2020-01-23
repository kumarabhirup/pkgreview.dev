import * as mongoose from 'mongoose'

import database from '../utils/database'

export const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    score: { type: Number, required: true, trim: true },
    total: { type: Number, required: true, trim: true },
  },
  review: { type: String, required: true, trim: true },
  package: { type: String, required: true, trim: true },
  createdAt: { type: String, required: true, trim: true },
  updatedAt: { type: String, required: true, trim: true },
})

const reviewModel = database.model('Review', reviewSchema)

export default reviewModel
