import dashboard from './dashboard';
import hotels from './hotels';
import employees from './employees';
import report from './reports';
import guest from './guest';
import residents from './residents';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, hotels, employees, guest, residents, ...report]
};

export default menuItems;
