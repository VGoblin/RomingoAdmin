import { FC, useContext, useState, useEffect } from 'react'
import { Typography, Grid, Switch , Button, Box, TextField} from '@mui/material'
import { ThemeContext } from './tools/ThemeContext'
import { gql, useMutation } from "@apollo/client";


export const Settings: any = ({ setLoggedIn }: any) => {
  const [darkMode, setDarkmode] = useContext(ThemeContext)
  const [dark, setDark] = useState(localStorage.getItem('darkmode') === 'true' ? true : false)
  const [production, setProduction] = useState(localStorage.getItem('productionEnv') === 'true' ? true : false)
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setDarkmode(dark)
    localStorage.setItem('darkmode', dark.toString())
  }, [dark])

  useEffect(() => {
    setProduction(production)
    localStorage.setItem('productionEnv', production.toString())
  }, [production])

  const logout = () => {
    localStorage.setItem('loggedIn', 'false')
    localStorage.setItem('email', '')
    localStorage.setItem('userId', '')
    setLoggedIn(false)
  } 

  const UPDATE_PASSWORD = gql`
    mutation($userId: String!, $newPassword: String!) {
      resetUserPassword(input: { userId: $userId, newPassword: $newPassword}) {
        status
      }
    }
  `;

  const [mutateFunction, { data, loading, error }] = useMutation(UPDATE_PASSWORD);
  console.log(data)
  console.log(error)

  const updatePassword = () => {
    setShowError(false)
    setShowSuccess(false)

    if (password.length > 7) {
      console.log(localStorage.getItem('userId'))
      console.log(password)
      mutateFunction({ variables: { userId: localStorage.getItem('userId'), newPassword: password }})
      setShowSuccess(true)
    } else {
      setShowError(true)
    }
  }

  return <Grid container>
    <Grid item xs={12}>
      <Typography variant='h3'> Settings </Typography>
    </Grid>
    <Grid item xs={12} sx={{ display: 'flex', pt: '2rem', alignItems: 'center' }}>
      <Typography variant='body1'> Dark mode </Typography> <Switch onClick={() => setDark(!dark)} checked={dark} sx={{ ml: '1rem' }} />
    </Grid>
 {/*   <Grid item xs={12} sx={{ display: 'flex', pt: '2rem', alignItems: 'center' }}>
      <Typography variant='body1'> Production ENV?  </Typography> <Switch onClick={() => setProduction(!production)} checked={production} sx={{ ml: '1rem' }} />
    </Grid>*/}
    <Box sx={{ mt: '1rem'}}>

      <TextField value={password} onChange={e => setPassword(e.target.value)} size='small' type='password' label="new password" />
      <Button variant="outlined" onClick={() => updatePassword()}>Update Password</Button>
      <Button variant="outlined" onClick={() => logout()}>Logout</Button>
      {showSuccess && <Typography sx={{ color: 'green'}}>Password updated.</Typography>}
      {showError && <Typography sx={{ color: 'red'}}>Password must be 8 characters or more.</Typography>}
    </Box>
  </Grid>
}