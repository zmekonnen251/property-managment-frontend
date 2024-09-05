// material-ui
import { Card, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //
import { currency } from 'store/constant';

const HotelChartCard = ({ name, data, netRevenue }) => {
  const chartData = {
    type: 'area',
    height: 95,
    options: {
      chart: {
        id: 'support-chart',
        sparkline: {
          enabled: true
        },
        color: '#111'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 1,
        colors: '#333'
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: true
        },
        y: {
          title: 'Ticket '
        },
        marker: {
          show: false
        }
      }
    },
    series: [
      {
        name: 'Daily Revenue',
        data: data,
        color: '#888'
      }
    ]
  };

  return (
    <Card sx={{ bgcolor: '#323232' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#666' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                {name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: '#fff' }}>
                {currency} {netRevenue}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default HotelChartCard;
