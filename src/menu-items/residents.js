import { IconUsersGroup } from '@tabler/icons-react';

const icons = {
  IconResidents: IconUsersGroup
};

// ==============================|| GUESTS MENU ITEMS ||============================== //

const residents = {
  id: 'residents',
  title: 'Residents',
  type: 'group',
  children: [
    {
      id: 'residents',
      title: 'Residents',
      type: 'collapse',
      target: false,
      icon: icons.IconResidents,
      children: [
        {
          id: 'residents',
          title: 'Residents',
          type: 'item',
          url: '/dashboard/residents',
          target: false
        },
        {
          id: 'new-resident',
          title: 'New Resident',
          type: 'item',
          url: '/dashboard/residents/new-resident',
          target: false
        }
      ]
    }
  ]
};

export default residents;
