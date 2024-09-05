import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from 'store/customizationSlice';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function DynamicIcon({ mode }) {
  if (mode === 'dark') return <DarkModeIcon />;
  return <LightModeIcon />;
}

export default function ThemeToggler() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.customization);

  return (
    <IconButton onClick={() => dispatch(toggleTheme())} sx={{ width: 40, height: 40 }}>
      <DynamicIcon mode={darkMode} />
    </IconButton>
  );
}
