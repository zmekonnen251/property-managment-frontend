import React from 'react';
import { Card, CardContent, CardActionArea, CardMedia, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CardComponent = ({ imageUrl, title, caption, text, actionLink }) => (
  <Card
    elevation={8}
    sx={{
      margin: 5,
      display: {
        xs: 'block',
        md: 'flex'
      },
      borderRadius: 4
    }}
  >
    <CardActionArea>
      <CardMedia
        component="img"
        image={imageUrl}
        alt=""
        sx={{
          width: '100%',
          height: 300,
          display: {
            xs: 'block',
            sm: 'flex'
          },
          flexBasis: '50%'
        }}
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '50%',
          backgroundColor: '#eee'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',

            fontSize: 12
          }}
        >
          {caption}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textTransform: 'uppercase',

            fontWeight: 'bold'
          }}
        >
          {text}
        </Typography>
        <Link to={actionLink}>
          <Button
            variant="contained"
            sx={{
              textTransform: 'uppercase',
              // color: '#f50057',
              fontWeight: 'bold',
              fontSize: 12,
              marginTop: 3,
              ml: '-10px'
            }}
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default CardComponent;
