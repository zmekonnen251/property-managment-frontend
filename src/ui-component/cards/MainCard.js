import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    { boxShadow, children, content = true, contentClass = '', contentSX = {}, darkTitle, secondary, shadow, sx = {}, title, ...others },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: '1px solid',
          borderColor: '#444',
          ':hover': {
            boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
          },
          ...sx
        }}
      >
        {/* card header and action */}
        {title && <CardHeader sx={headerSX} title={darkTitle ? <Typography variant="h3">{title}</Typography> : title} action={secondary} />}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
