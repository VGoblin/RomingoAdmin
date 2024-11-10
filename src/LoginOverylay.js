import { Button, Grid, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { gql, useLazyQuery } from "@apollo/client";

export const LoginOverlay = ({ setLoggedIn }) => {

  const LOGIN_QUERY = gql`
    query ($email: String!, $password: String!) {
      loginUser(input: { email: $email, password: $password }) {
       id
       email
       isAdmin
      }
    }
  `;

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)

  const [loginUser, { called, loading, data }] = useLazyQuery(LOGIN_QUERY, {
    variables: {
      email: username,
      password: password
    }
  });

  useEffect(() => {
    if (data && data.loginUser && data.loginUser.isAdmin && data.loginUser.id !== 'not found') {
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('email', username)
      localStorage.setItem('userId', data.loginUser.id)
      setLoggedIn(true)
    } else if (data && data.loginUser) {
      setShowError(true)
    } else if (data && data.loginUser === null) {
      setShowError(true)
    }
  }, [data])

  const login = () => {
    setShowError(false)
    loginUser()
    // if (username === 'zach' && password === 'Sacramento0') {
    //   setLoggedIn(true)
    //   localStorage.setItem('user', username)
    //   localStorage.setItem('loggedIn', 'true')
    // }
  }

  return <Grid container sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', position: 'fixed', zIndex: 1402, top: '0px', bottom: '0px', background: '#33333380', backdropFilter: 'blur(6px)', left: '0px', right: '0px' }}>
    <Grid sx={{ flexDirection: 'column', background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      You must login to continue
      <TextField value={username} onChange={e => setUsername(e.target.value)} sx={{ mt: '1rem' }} size='small' label="username" />
      <TextField value={password} onChange={e => setPassword(e.target.value)} sx={{ mt: '1rem', mb: '1rem' }} size='small' type='password' label="password" />
      <Button onClick={login} variant='contained' size='small' fullWidth> Go </Button>
      {showError && <Typography sx={{ color: 'red', p: '0.5rem'}}>*Incorrect email / password</Typography>}
    </Grid>
  </Grid>
}