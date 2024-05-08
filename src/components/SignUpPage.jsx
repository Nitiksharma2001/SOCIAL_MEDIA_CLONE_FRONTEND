import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import LoadingButton from '@mui/lab/LoadingButton'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { Button, Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { postWithoutAuth } from '../utils/Request'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../firebaseConfig'

const defaultTheme = createTheme()

export default function SignUpPage() {
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsButtonLoading(true)
    const data = new FormData(event.currentTarget)
    const newUserData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    }
    try {
      const storageRef = ref(
        storage,
        `profilePictures/${data.get('file').name}`
      )
      await uploadBytes(storageRef, data.get('file'))
      const imageAddress = await getDownloadURL(storageRef)
      await postWithoutAuth('auth/signup', { ...newUserData, imageAddress })
      navigate('/signin')
    } finally {
      setIsButtonLoading(false)
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete='given-name'
                  name='name'
                  required
                  fullWidth
                  id='name'
                  label='Name'
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  component='label'
                  variant='secondary'
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    display: 'flex',
                  }}
                >
                  Upload Profile Picture
                  <VisuallyHiddenInput type='file' name='file' />
                </Button>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <LoadingButton
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              size='large'
              type='submit'
              loading={isButtonLoading}
              loadingPosition='end'
              variant='contained'
            >
              <span>sign in</span>
            </LoadingButton>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link to='/signin'>Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
