import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ============================|| FIREBASE - LOGIN ||============================ //

import useAuth from 'hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from 'features/authentication/authApiSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { ArrowForward } from '@mui/icons-material';
import { useGetHotelsQuery } from 'features/admin/hotels/hotelsApiSlice';
const schema = yup.object().shape({
  email: yup.string().required().email('Email is invalid'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
});

const Login = ({ ...others }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const { data: hotels } = useGetHotelsQuery();
  const user = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isSuccess, isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    await login(values);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Login success', {
        toastId: 'success1'
      });
      if (['admin', 'manager', 'owner'].includes(user.role)) {
        navigate('/dashboard');
      } else if (user.role === 'careTaker') {
        navigate('/rental-reservations');
      } else if (user.role === 'receptionist') {
        const hotel = hotels?.find((hotel) => user.hotels?.includes(hotel.id) && hotel?.type === 'guest-house');

        navigate(`/hotels/${hotel?.id}`);
      } else if (user.role === 'cleaner') {
        navigate(`/hotels/${user.hotels[0]}/rooms`);
      } else {
        navigate(location?.state?.from ? location.state.from : '/');
      }
    }

    return () => {
      toast.dismiss('success1');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigate, location, user?.role]);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

            <Button
              variant="outlined"
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`
              }}
              disableRipple
              disabled
            >
              Sign-In
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <form noValidate onSubmit={handleSubmit(onSubmit)} {...others}>
        <FormControl fullWidth error={Boolean(errors?.email?.message)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="email"
            name="email"
            {...register('email')}
            label="Email Address / Username"
            autocomplete='off'
            error={!!errors.email}
          />
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.email.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth error={Boolean(errors?.password?.message)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-login"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autocomplete='off'

            {...register('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            inputProps={{}}
          />
          {errors.password && (
            <FormHelperText error id="standard-weight-helper-text-password-login">
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label="Remember me"
          />
          <Link to="/auth/forgot-password">
            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
              Forgot Password?
            </Typography>
          </Link>
        </Stack>
        {errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>{errors.submit}</FormHelperText>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <LoadingButton
              disabled={isSubmitting || isLoading}
              loading={isSubmitting || isLoading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="secondary"
              endIcon={<ArrowForward />}
              sx={{ textTransform: 'uppercase' }}
            >
              LOG IN
            </LoadingButton>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
};

export default Login;
