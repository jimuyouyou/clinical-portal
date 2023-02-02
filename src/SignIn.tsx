import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useForm, SubmitHandler } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PropTypes from 'prop-types';


const propTypes = {
  onSignIn: PropTypes.func.isRequired,
};

type Props = PropTypes.InferProps<typeof propTypes>;

const registerSchema = object({
  username: string()
    .min(1, 'Username is required')
    .max(64, 'Username must be less than 64 characters'),
  password: string()
    .min(1, 'Password is required')
    .min(4, 'Password must be more than 4 characters')
    .max(32, 'Password must be less than 32 characters'),
});

type RegisterInput = TypeOf<typeof registerSchema>;


const theme = createTheme();
export default function SignIn(props: Props) {
  const [notMatch, setNotMatch] = useState(false);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = async (values: any) => {
    const { username, password } = values;
    console.log('inputs', [username, password]);
    if (username && password) {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + window.btoa(username + ":" + password),
        },
      });

      const { sessionToken } = await res.json();
      console.log('signin-token', sessionToken);
      if (sessionToken) {
        window.sessionStorage.setItem('ft-session-token', sessionToken);
        window.sessionStorage.setItem('ft-logged-in-user', username);
        props.onSignIn();
      } else {
        setNotMatch(true);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
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
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              // name="username"
              autoComplete="username"
              autoFocus

              error={!!errors['username']}
              helperText={errors['username'] ? errors['username'].message : ''}
              {...register('username')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              // name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"

              error={!!errors['password']}
              helperText={errors['password'] ? errors['password'].message : ''}
              {...register('password')}
            />
            {notMatch && <Alert severity="error">Invalid username or password!</Alert>}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}