import { Alert } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import React from 'react'

const Notification = ({ message }) => {
  return (
    <Alert icon={<CheckIcon fontSize='inherit' />} severity='success'>
      {message}
    </Alert>
  )
}

export default Notification
