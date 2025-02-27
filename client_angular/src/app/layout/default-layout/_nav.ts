import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Rooms',
    url: '/room',
    iconComponent: { name: 'cil-location-pin' },
    children: [
      {
        name: 'Rooms View',
        url: '/room/room_add',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Room Book',
        url: '/room/room_book_view',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Employee',
    url: '/employee',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Employee Add',
        url: '/employee/employee_add',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Employee View',
        url: '/employee/employee_view',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Guest',
    url: '/guest',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Guest Add',
        url: '/guest/guest_add',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Guest View',
        url: '/guest/guest_view',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Guide',
    url: '/guide',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Guide Add',
        url: '/guide/guide_add',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Guide View',
        url: '/guide/guide_view',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Order',
    url: '/order',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Order Add',
        url: '/order/order_add',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Order View',
        url: '/order/order_view',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Food',
    url: '/food',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Food Add',
        url: '/food/food_add',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Food View',
        url: '/food/food_view',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Customer',
    url: '/customer',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Customer View',
        url: '/customer/customer_view',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Status/Category',
    title: true
  },
  {
    name: 'Room Category',
    url: '/room/room_category_view',
    icon: 'nav-icon-bullet'
  },
  {
    name: 'Employee Type',
    url: '/employee/employee_type',
    icon: 'nav-icon-bullet'
  },
  {
    name: 'Order Status',
    url: '/order/order_status',
    icon: 'nav-icon-bullet'
  },
  {
    name: 'Food Status',
    url: '/food/food_status',
    icon: 'nav-icon-bullet'
  },
  {
    name: 'Item Category',
    url: '/food/item_category',
    icon: 'nav-icon-bullet'
  },
  {
    name: 'User Role',
    url: '/role/user_role',
    icon: 'nav-icon-bullet'
  },
  {
    name: 'Report',
    title: true
  },
  {
    name: 'Setting',
    title: true
  },
  {
    name: 'User',
    iconComponent: { name: 'cil-user' },
    url: '/user/user_view'
  },
  {
    name: 'Change Password',
    iconComponent: { name: 'cil-user' },
    url: '/change_password/password_chang'
  },
  {
    name: 'Logout',
    url: '/login',
    iconComponent: { name: 'cil-account-logout' },
  }

];
