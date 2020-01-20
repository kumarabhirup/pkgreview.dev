import React from 'react'
import Upload from 'rc-upload'

import { Body, UploadButton } from '../lib/styles/styled'

export default function AnimatedMailUi() {
  return (
    <Body className="block fixed">
      <center className="i-used-center-tag-forgive-me-please-dont-kill-me">
        <h2>Upload .csv file</h2>
        <Upload>
          <UploadButton className="block accent" type="button">
            Upload
          </UploadButton>
        </Upload>
      </center>
    </Body>
  )
}
