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

import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForgotPasswordMutation } from 'features/authentication/authApiSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { ArrowForward } from '@mui/icons-material';
const schema = yup.object().shape({
  email: yup.string().required().email('Email is invalid')
});

const ForgotPasswordForm = ({ ...others }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPassword, { isSuccess, isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    await forgotPassword(values.email);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Password Reset instruction sent to your email.', {
        toastId: 'success1',
        autoClose: 3000,
        onClose: () => {
          navigate('/auth/login');
        }
      });
    }

    return () => {
      toast.dismiss('success1');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigate, location]);

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
              FORGOT PASSWORD
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
        <FormControl fullWidth error={Boolean(errors?.email?.message)} sx={{ ...theme.typography.customInput }}>
          <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-login"
            type="email"
            name="email"
            {...register('email')}
            label="Email Address"
            error={!!errors.email}
            autocomplete='off'

          />
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.email.message}
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
              Submit
            </LoadingButton>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
