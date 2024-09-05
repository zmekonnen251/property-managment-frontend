import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LinkButton = ({ title, to, color = 'primary', variant = 'contained', sx = {} }) => {
  const navigate = useNavigate();

  return (
    <Button variant={variant} color={color} size="large" sx={sx} onClick={() => navigate(to)}>
      {title}
    </Button>
  );
};

export default LinkButton;
