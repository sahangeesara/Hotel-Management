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
  // // {
  // //   name: 'Icons',
  // //   iconComponent: { name: 'cil-star' },
  // //   url: '/icons',
  // //   children: [
  // //     {
  // //       name: 'CoreUI Free',
  // //       url: '/icons/coreui-icons',
  // //       icon: 'nav-icon-bullet',
  // //       badge: {
  // //         color: 'success',
  // //         text: 'FREE'
  // //       }
  // //     },
  // //     {
  // //       name: 'CoreUI Flags',
  // //       url: '/icons/flags',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'CoreUI Brands',
  // //       url: '/icons/brands',
  // //       icon: 'nav-icon-bullet'
  // //     }
  // //   ]
  // // },
  // // {
  // //   name: 'Notifications',
  // //   url: '/notifications',
  // //   iconComponent: { name: 'cil-bell' },
  // //   children: [
  // //     {
  // //       name: 'Alerts',
  // //       url: '/notifications/alerts',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'Badges',
  // //       url: '/notifications/badges',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'Modal',
  // //       url: '/notifications/modal',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'Toast',
  // //       url: '/notifications/toasts',
  // //       icon: 'nav-icon-bullet'
  // //     }
  // //   ]
  // // },
  // // {
  // //   name: 'Widgets',
  // //   url: '/widgets',
  // //   iconComponent: { name: 'cil-calculator' },
  // //   badge: {
  // //     color: 'info',
  // //     text: 'NEW'
  // //   }
  // // },
  // // {
  // //   title: true,
  // //   name: 'Extras'
  // // },
  // // {
  // //   name: 'Pages',
  // //   url: '/login',
  // //   iconComponent: { name: 'cil-star' },
  // //   children: [
  // //     {
  // //       name: 'Login',
  // //       url: '/login',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'Register',
  // //       url: '/register',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'Error 404',
  // //       url: '/404',
  // //       icon: 'nav-icon-bullet'
  // //     },
  // //     {
  // //       name: 'Error 500',
  // //       url: '/500',
  // //       icon: 'nav-icon-bullet'
  // //     }
  // //   ]
  // // },
  // // {
  // //   title: true,
  // //   name: 'Links',
  // //   class: 'mt-auto'
  // // },
  // // {
  // //   name: 'Docs',
  // //   url: 'https://coreui.io/angular/docs/5.x/',
  // //   iconComponent: { name: 'cil-description' },
  // //   attributes: { target: '_blank' }
  // // }
];
