import { createTheme } from '@mui/material/styles';

// assets
import colors from '../assets/scss/_themes-vars.module.scss';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  const color = colors;

  const themeOption = {
    colors: color,
    customization,
    heading: customization?.darkMode === 'dark' ? color.darkTextTitle : color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    darkTextPrimary: customization?.darkMode === 'dark' ? color.darkTextPrimary : color.grey700,
    darkTextSecondary: customization?.darkMode === 'dark' ? color.darkTextSecondary : color.grey700,
    textDark: customization?.darkMode === 'dark' ? color.grey200 : color.grey900,
    menuSelected: customization?.darkMode === 'dark' ? color.darkSecondary : color.secondary,
    menuSelectedBack: customization?.darkMode === 'dark' ? color.darkSecondaryDark : color.secondary,
    divider: customization?.darkMode === 'dark' ? color.grey600 : color.grey600
  };

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '58px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;