import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import themes from 'themes';
// import config from 'config';
import { useSelector, useDispatch } from 'react-redux';
import Routes from 'routes';
import NavigationScroll from 'layout/NavigationScroll';
import { useGetHotelsQuery } from 'features/admin/hotels/hotelsApiSlice';
import { setProperties } from 'store/customizationSlice';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Africa/Johannesburg');

function App() {
  const dispatch = useDispatch();
  const { data: hotelsData } = useGetHotelsQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const theme = React.useMemo(() => themes(customization), [customization]);

  // const themeOptions = {
  //   isOpen: [], // for active default menu
  //   defaultId: 'dashboard',
  //   fontFamily: config.fontFamily,
  //   borderRadius: config.borderRadius,
  //   opened: true,
  //   darkMode: 'dark'
  // };
  useEffect(() => {
    const hotels = hotelsData?.map((hotel, i) => ({
      id: hotel.id,
      name: hotel.name,
      bg: `rgba(${i === 1 ? 40 * 4 : 40 * 1},${35 * i},${i === 1 ? 40 * 2 : 45 * 1},0.8)`,
      hoverBg: `rgba(${50 * i},${27 * i},${67 * i},0.6)`
      // set random color for each hotel but keep it consistent
    }));

    dispatch(setProperties(hotels));
    localStorage.setItem('properties', JSON.stringify({ properties: hotels }));
  }, [hotelsData, dispatch]);

  const customization = useSelector((state) => state.customization);
  return (
    <ThemeProvider theme={themes(customization)}>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <NavigationScroll>
        <Routes />
      </NavigationScroll>
    </ThemeProvider>
  );
}

export default App;
