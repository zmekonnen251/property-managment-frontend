import { IconUser, IconUsers } from '@tabler/icons';
import useAuth from 'hooks/useAuth';

const icons = {
  IconUser,
  IconUsers
};

// ==============================|| EMPLOYEES MENU ITEMS ||============================== //
// eslint-disable-next-line react-hooks/rules-of-hooks
const user = useAuth();
const newEmployee = ['admin', 'manager'].includes(user.role)
  ? [
      {
        id: 'new-employee',
        title: 'Add Employee',
        type: 'item',
        url: '/dashboard/employees/new-employee',
        target: false
      }
    ]
  : [];

const employees = {
  id: 'employees',
  title: 'Employees',
  type: 'group',
  children: [
    {
      id: 'employees',
      title: 'Employees',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: 'employees',
          title: 'Employees',
          type: 'item',
          url: '/dashboard/employees',
          target: false
        },
        ...newEmployee
      ]
    }
  ]
};

export default employees;
