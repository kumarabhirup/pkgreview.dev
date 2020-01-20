/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */

import * as cron from 'node-cron'
import { PubSub } from 'graphql-yoga'
import {
  stringProcessor,
  createTransport,
  isForLoop,
  BmcConfigurationFile,
} from 'bulk-mail-cli'

import Mail from 'nodemailer/lib/mailer'

const sendMails = async (
  parent,
  {
    configuration,
    shouldRestart = false,
  }: { configuration: BmcConfigurationFile; shouldRestart: boolean },
  { pubsub }: { pubsub: PubSub }
): Promise<object> => {
  // Create a NodeMailer transporter
  const transporter: Mail = createTransport(configuration)

  // Define the variables
  const {
    mail: { to, theme },
  } = configuration

  let csvData
  let htmlData

  try {
    csvData = JSON.parse(to)
    htmlData = theme
  } catch (error) {
    throw new Error('Data not provided in the preferred format')
  }

  // Function that will run after the task is done.
  const logResult = (error?: Error): void => {
    // if (isError) {
    if (error) {
      throw new Error(error?.message)
    } else {
      throw new Error('Some problem occured.')
    }
  }

  // Gather important information
  let sentTo = configuration?.nonUserData?.sentTo

  let csvDataWithoutSentTo

  if (shouldRestart) {
    csvDataWithoutSentTo = csvData
  } else {
    csvDataWithoutSentTo = csvData.filter(row => {
      if (sentTo) return !sentTo.includes(row.email)
      return true
    })
  }

  const mailIntervalDuration: string =
    configuration?.configuration?.mailInterval || '*/10 * * * * *'

  let dataIndex = 0

  const channelHash = Math.random()
    .toString(36)
    .substr(2, 5)

  async function sendMail(
    row,
    task: cron.ScheduledTask | 'forloop'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // String Processor
    const processString = (string): string =>
      stringProcessor(string, { ...row, ...process.env }) // TODO: Find a way to process env variables

    try {
      await transporter.sendMail({
        from: processString(configuration?.mail?.from),
        subject: processString(configuration?.mail?.subject),
        html: processString(htmlData),
        to: processString(row?.email),

        // Use string processors on the filename of the attachment.
        attachments: configuration.mail.attachments
          ? configuration?.mail?.attachments.map(attachment => ({
              ...attachment,
              filename: processString(attachment.filename),
              path: attachment?.path.startsWith('http')
                ? processString(attachment.path)
                : null, // TODO: 'path' management
            }))
          : [],
      })

      if (!sentTo) sentTo = []

      sentTo.push(row?.email)

      // GraphQL way to log messages live
      pubsub.publish(`newMail-${channelHash}`, {
        newMail: { email: row?.email, channelHash },
      })
    } catch (error) {
      logResult(error)

      if (typeof task === 'object') task.destroy()
      else return 'break'
    }

    if (dataIndex > csvDataWithoutSentTo.length) {
      logResult()

      if (typeof task === 'object') task.destroy()
      else return 'break'
    }

    dataIndex++
  }

  const isAForLoop = isForLoop(mailIntervalDuration)

  if (csvDataWithoutSentTo.length > 0) {
    if (isAForLoop) {
      // Do in For-Loop
      for (const row of csvDataWithoutSentTo) {
        let sendingProcess

        if (row) {
          sendingProcess = await sendMail(row, 'forloop')
        }

        if (
          typeof sendingProcess === 'function' &&
          sendingProcess() === 'break'
        ) {
          break
        }
      }
    } else {
      // Do in Cron
      const task: cron.ScheduledTask = cron.schedule(
        mailIntervalDuration,
        async () => {
          const row = csvDataWithoutSentTo[dataIndex]

          if (row) {
            await sendMail(row, task)
          }
        }
      )

      task.start()
    }
  } else {
    if (csvData.length > 0 && sentTo.length > 0) {
      logResult(
        new Error(
          'Email campaign is already complete. Please check your updated configuration file'
        )
      )
    } else {
      logResult(new Error('The provided CSV file is probably empty'))
    }

    logResult(new Error('csvDataWithoutSentTo is empty'))
  }

  return {
    message: isAForLoop ? 'Emails sent' : 'Email Sending process started',
    channelHash,
  }
}

export default sendMails
