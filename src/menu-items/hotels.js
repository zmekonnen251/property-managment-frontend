import { IconBuilding } from '@tabler/icons';
import { store } from 'app/store';
import useAuth from 'hooks/useAuth';

const icons = {
  IconBuilding
};

// ==============================|| HOTELS MENU ITEMS ||============================== //
const properties = store.getState().customization.properties;
// eslint-disable-next-line react-hooks/rules-of-hooks
const user = useAuth();

const hotelsMenuItems = properties
  ? properties.map((property) => ({
      id: `property-${property.id}`,
      title: property.name,
      type: 'item',
      url: `/dashboard/hotels/${property.id}`,
      target: false
    }))
  : [];

const newProperty =
  user.role === 'admin'
    ? [
        {
          id: 'hotels-new',
          title: 'New Property',
          type: 'item',
          url: '/dashboard/hotels/new-hotel'
        }
      ]
    : [];

const hotels = {
  id: 'hotels',
  title: 'Properties',
  type: 'group',
  children: [
    {
      id: 'hotels',
      title: 'Properties',
      url: '/dashboard/hotels',
      type: 'collapse',
      icon: icons.IconBuilding,
      children: [
        {
          id: 'hotels',
          title: 'Properties',
          type: 'item',
          url: '/dashboard/hotels'
        },
        ...newProperty,

        ...hotelsMenuItems
      ]
    }
  ]
};

export default hotels;
