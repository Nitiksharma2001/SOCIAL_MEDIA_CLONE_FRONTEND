import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { getWithoutAuth } from '../utils/Request'
import { Alert, Collapse } from '@mui/material'
import { authorization } from '../constants/Constants'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/UserSlice'

const defaultTheme = createTheme()

export default function SignInPage() {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const data = new FormData(event.currentTarget)
      const email = data.get('email'), password = data.get('password')
      const result = await getWithoutAuth(`auth/signin/${email}/${password}`)
      console.log(result)
      setMessage(result.message)
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
      }
      if (result.message === authorization.USER_VERIFIED) {
        dispatch(setUser(result.user))
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Collapse in={message !== ''}>
        <Alert
          severity={
            message === authorization.USER_VERIFIED ? 'success' : 'error'
          }
        >
          {message}
        </Alert>
      </Collapse>

      <Grid container component='main' sx={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign in
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
              <LoadingButton
                fullWidth
                type='submit'
                sx={{ mt: 3, mb: 2 }}
                size='large'
                loading={loading}
                loadingPosition='end'
                variant='contained'
              >
                <span>sign in</span>
              </LoadingButton>

              <Grid container>
                <Grid item>
                  <Link to='/signup'>Don't have an account? Sign Up</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
    </ThemeProvider>
  )
}
