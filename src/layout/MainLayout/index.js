import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import navigation from 'menu-items';
import { setMenu } from 'store/customizationSlice';
import { drawerWidth } from 'store/constant';

// assets
import { IconChevronRight } from '@tabler/icons';
import useAuth from 'hooks/useAuth';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }
      : {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const { isLoggedIn, role } = useAuth();

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch(setMenu());
  };
  // Handle left drawer
  if (!isLoggedIn) {
    toast.error('You are not authorized to access this page!', {
      position: 'top-center',
      toastId: 'protected-route-employee'
    });

    return <Navigate to="/auth/login" state={{ from: location.pathname }} />;
  }

  return isLoggedIn && ['admin', 'owner', 'manager'].includes(role) ? (
    <Box sx={{ display: 'flex', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          [theme.breakpoints.up('md')]: {
            width: '100% !important',
            padding: '0px auto !important'
          },
          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar
          sx={{
            [theme.breakpoints.down('md')]: {
              py: 0
            }
          }}
        >
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}

        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign card />

        <Outlet />
      </Main>
    </Box>
  ) : (
    <Navigate to="/auth/login" state={{ from: location.pathname }} />
  );
};

export default MainLayout;
