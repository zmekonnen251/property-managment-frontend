import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material';

// project imports
import Header from '../MainLayout/Header';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';

// assets

// styles

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const auth = useAuth();
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/auth/login')
    }
  }, [location, auth.isLoggedIn])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'theme.palette.dark.main' : theme.palette.primary.light,
          transition: 'none'
        }}
      >
        <Toolbar
          sx={{
            [theme.breakpoints.down('md')]: {
              py: 1
            }
          }}
        >
          <Header
            handleLeftDrawerToggle={() => { }}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.light
            }}
          />
        </Toolbar>
      </AppBar>

      {/* drawer */}

      {/* main content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          minHeight: '100vh',
          paddingTop: {
            xs: 9,
            sm: 9,
            md: 12,
            lg: 12
          },
          width: '80%',
          [theme.breakpoints.down('md')]: {
            px: 3
          }
        }}
      >
        {/* breadcrumb */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
