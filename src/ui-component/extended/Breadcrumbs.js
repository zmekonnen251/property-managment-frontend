import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project imports
import config from 'config';
import { gridSpacing } from 'store/constant';

// assets
import { IconTallymark1 } from '@tabler/icons';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import BackButton from 'components/BackButton';

const linkSX = {
  display: 'flex',
  color: 'grey.900',
  textDecoration: 'none',
  alignContent: 'center',
  alignItems: 'center'
};

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({ card, divider, icon, icons, maxItems, navigation, rightAlign, separator, title, titleBottom, ...others }) => {
  const theme = useTheme();
  const location = useLocation();
  const iconStyle = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main
  };

  const [main, setMain] = useState();
  const [item, setItem] = useState();

  // set active item state

  const getCollapse = (menu) => {
    if (menu.children) {
      menu.children.filter((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type && collapse.type === 'item') {
          if (location.pathname === config.basename + collapse.url) {
            setMain(menu);

            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  useEffect(() => {
    navigation?.items?.map((menu) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu);
      }
      return false;
    });
  });

  // item separator
  const SeparatorIcon = separator;
  const separatorIcon = separator ? <SeparatorIcon stroke={1.5} size="1rem" /> : <IconTallymark1 stroke={1.5} size="1rem" />;

  let mainContent;
  let itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === 'collapse') {
    CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
    mainContent = (
      <Link to={main.url} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="subtitle1" sx={linkSX}>
          {icons && <CollapseIcon style={iconStyle} />}
          {main.title}
        </Typography>
      </Link>
    );
  }

  // items

  if (item && item.type === 'item') {
    itemTitle = item.title;

    ItemIcon = item.icon ? item.icon : AccountTreeTwoToneIcon;
    itemContent = (
      <Link to={item.url} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography
          variant="subtitle1"
          sx={{
            display: 'flex',
            textDecoration: 'none',
            alignContent: 'center',
            alignItems: 'center',
            color: 'grey.500'
          }}
        >
          {icons && <ItemIcon style={iconStyle} />}
          {itemTitle}
        </Typography>
      </Link>
    );

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <Card
          sx={{
            [theme.breakpoints.up('sm')]: {
              mb: 2
            },
            border: card === false ? 'none' : '1px solid',
            borderColor: theme.palette.primary[200] + 75,
            background: card === false ? 'transparent' : theme.palette.background.default
          }}
          {...others}
        >
          <Box
            sx={{
              [theme.breakpoints.down('sm')]: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              },
              p: 2,
              pl: card === false ? 0 : 2
            }}
          >
            <BackButton
              sx={{
                [theme.breakpoints.up('sm')]: {
                  display: 'none'
                }
              }}
              variant="outlined"
              size="medium"
            />

            <Grid
              container
              direction={rightAlign ? 'row' : 'column'}
              justifyContent={rightAlign ? 'space-between' : 'flex-start'}
              alignItems={rightAlign ? 'center' : 'flex-start'}
              spacing={1}
            >
              {title && !titleBottom && (
                <Grid item>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 500,
                        [theme.breakpoints.down('sm')]: {
                          display: 'none'
                        }
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Stack>
                </Grid>
              )}
              <Grid item>
                <MuiBreadcrumbs
                  sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                  aria-label="breadcrumb"
                  maxItems={maxItems || 8}
                  separator={separatorIcon}
                >
                  <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography color="inherit" variant="subtitle1" sx={linkSX}>
                      {icons && <HomeTwoToneIcon sx={iconStyle} />}
                      {icon && <HomeIcon sx={{ ...iconStyle, mr: 0 }} />}
                      {!icon && 'Dashboard'}
                    </Typography>
                  </Link>
                  {mainContent}
                  {itemContent}
                </MuiBreadcrumbs>
              </Grid>
              {title && titleBottom && (
                <Grid item>
                  <Typography variant="h3" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
          {card === false && divider !== false && <Divider sx={{ borderColor: theme.palette.primary.main, mb: gridSpacing }} />}
        </Card>
      );
    }
  }

  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  divider: PropTypes.bool,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  maxItems: PropTypes.number,
  navigation: PropTypes.object,
  rightAlign: PropTypes.bool,
  separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  title: PropTypes.bool,
  titleBottom: PropTypes.bool
};

export default Breadcrumbs;
