import { IconReport, IconInbox } from '@tabler/icons';

const icons = {
  IconReport,
  IconInbox
};

// ==============================|| REPORTS MENU ITEMS ||============================== //

const reports = [
  {
    id: 'reports',
    title: 'Reports',
    type: 'group',
    children: [
      {
        id: 'reports',
        title: 'Reports',
        type: 'collapse',
        icon: icons.IconReport,
        children: [
          {
            id: 'reports',
            title: 'Reports',
            type: 'item',
            url: '/dashboard/reports',
            target: false
          },
          {
            id: 'balances',
            title: 'Balances',
            type: 'item',
            url: '/dashboard/reports/balances',
            target: false
          }
        ]
      }
    ]
  },
  {
    id: 'email',
    title: 'Email',
    type: 'group',
    children: [
      {
        id: 'email',
        title: 'Email',
        type: 'item',
        icon: icons.IconInbox,
        url: 'https://bhandjkpropinv.dedicated.co.za:2087/roundcube',
        target: true,
        external: true
      }
    ]
  }
];

export default reports;
