import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BackButton = ({ size = 'small', color = 'primary', variant = 'text', to = -1 }) => {
  const navigate = useNavigate();

  return (
    <Button sx={sx} variant={variant} color={color} size={size} startIcon={<ArrowBack />} onClick={() => window.history.back()}>
      Back
    </Button>
  );
};

export default BackButton;
