import * as mongoose from 'mongoose'

import userModel from '../../models/User'

const loginMutation = async (
  parent,
  args,
  { db }: { db: mongoose.Connection },
  info
): Promise<any> => {
  const saveUser = await userModel
    .insertMany([{ name: 'Kumar Abhirup', email: 'kum@bifvjknsg.com' }])
    .then(data => data[0])

  console.log(saveUser[0])
}

export default loginMutation
