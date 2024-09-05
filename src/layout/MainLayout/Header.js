import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase } from '@mui/material';

// assets
import { IconMenu2 } from '@tabler/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { useLogoutMutation } from 'features/authentication/authApiSlice';
import { LoadingButton } from '@mui/lab';
import LinkButton from 'components/LinkButton';
import ThemeToggler from 'components/ThemeToggler';
// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout, { isLoading, isSuccess }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
  };
  if (isSuccess) navigate('/auth/login');
  // check if the location pathname matches the regex, if it does, then it will return true, otherwise false
  // location.ptchname starts with /dashboard or /dashboard/ and then any character

  return (
    <>
      {/* logo & toggler button */}
      {location.pathname.split('/')[1] === 'dashboard' && (
        <Box
          sx={{
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              width: 'auto'
            }
          }}
        >
          <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                '&:hover': {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light
                }
              }}
              onClick={handleLeftDrawerToggle}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Box>
      )}

      <Box
        sx={{
          ml: 3,
          width: 228,
          display: 'flex'
        }}
      >
        {user?.isLoggedIn && (
          <>
            <LoadingButton
              loading={isLoading}
              onClick={handleLogout}
              size="medium"
              variant="text"
              sx={{
                [theme.breakpoints.down('md')]: {
                  fontSize: '1rem'
                }
              }}
            >
              LOG OUT
            </LoadingButton>
          </>
        )}

        {['admin', 'manager'].includes(user?.role) && location.pathname.split('/')[1] === 'dashboard' && (
          <LinkButton
            to="/"
            title="Properties"
            variant="text"
            sx={{
              ml: 2,
              textTransform: 'uppercase',
              [theme.breakpoints.down('md')]: {
                fontSize: '1rem'
              }
            }}
          />
        )}

        {['admin', 'manager'].includes(user?.role) && location.pathname.split('/')[1] !== 'dashboard' && (
          <LinkButton
            to="/dashboard"
            title="Dashboard"
            variant="text"
            sx={{
              ml: 2,
              textTransform: 'uppercase',
              [theme.breakpoints.down('md')]: {
                fontSize: '1rem'
              }
            }}
          />
        )}

        {!user?.isLoggedIn && (
          <Link to="auth/login" style={{ textDecoration: 'none' }}>
            <Button
              variant="text"
              size="medium"
              sx={{
                [theme.breakpoints.down('md')]: {
                  fontSize: '1rem'
                }
              }}
            >
              LOG IN
            </Button>
          </Link>
        )}
      </Box>
      {/* header search */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* A dark/light mode togler with custome icons */}
      <Box sx={{ flexGrow: 1 }} />
      <ThemeToggler />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
