import { IconUsersGroup } from '@tabler/icons-react';

const icons = {
  IconGuests: IconUsersGroup
};

// ==============================|| GUESTS MENU ITEMS ||============================== //

const guests = {
  id: 'guests',
  title: 'Guests',
  type: 'group',
  children: [
    {
      id: 'guests',
      title: 'Guests',
      type: 'item',
      url: '/dashboard/guests',
      target: false,
      icon: icons.IconGuests
    }
  ]
};

export default guests;
