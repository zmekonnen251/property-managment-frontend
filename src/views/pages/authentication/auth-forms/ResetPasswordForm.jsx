import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Divider, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// third party
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from 'features/authentication/authApiSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { ArrowForward } from '@mui/icons-material';
const schema = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const ResetPasswordForm = ({ ...others }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword, { isSuccess, isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    await resetPassword({ password: values.password, token });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Password Reset instruction sent to your email.', {
        toastId: 'success1',
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER,
        onClose: () => {
          navigate('/auth/login');
        }
      });
    }

    return () => {
      toast.dismiss('success1');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigate, token]);

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
              Reset Password
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Enter your Email</Typography>
          </Box>
        </Grid>
      </Grid>

      <form noValidate onSubmit={handleSubmit(onSubmit)} {...others}>
        <FormControl fullWidth error={Boolean(errors?.password?.message)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="password"
            name="password"
            {...register('password')}
            label="Password"
            error={!!errors.password}
          />
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth error={Boolean(errors?.confirmPassword?.message)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">Confirm Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="password"
            name="confirmPassword"
            {...register('confirmPassword')}
            label="Confirm Password"
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.confirmPassword.message}
            </FormHelperText>
          )}
        </FormControl>

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Link to="/auth/login">
            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
              Sign in
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
              Reset Password
            </LoadingButton>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
};

export default ResetPasswordForm;
