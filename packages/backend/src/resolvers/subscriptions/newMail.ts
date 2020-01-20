/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { PubSub } from 'graphql-yoga'

const newMail = (
  parent,
  { channelHash }: { channelHash: string },
  { pubsub }: { pubsub: PubSub }
): AsyncIterator<unknown, any, undefined> =>
  pubsub.asyncIterator(`newMail-${channelHash}`)

export default {
  subscribe: newMail,
}
