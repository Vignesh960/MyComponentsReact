import routes from "./routes";

const menuItems = {
  items: [    
    {
      id: 'ui-forms',
      title: 'VIEWS',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Projects',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/tables/projects'
        },
        {
          id: 'table',
          title: 'Milestones',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/milestone'
        },
        {
          id: 'table',
          title: 'Monthly Milestones',
          type: 'item',
          icon: 'feather icon-server',
          url: '/monthlymilestones'
        }
      ]
    },
    {
      id: 'chart-maps',
      title: 'User Management',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'charts',
          title: 'Users',
          type: 'item',
          icon: 'feather icon-user',
          url: '/users'
        },
        {
          id: 'charts',
          title: 'User Config',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/userconfiguration'
        },
        
      ]
    }, 
    {
      id: 'chart-maps',
      title: 'Production Users',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'charts',
          title: 'Employee List',
          type: 'item',
          icon: 'feather icon-user',
          url: '/employeedetails'
        },  
        {
          id: 'charts',
          title: 'Project Tagging',
          type: 'item',
          icon: 'feather icon-user',
          url: '/taggingdetails'
        },         
      ]
    },
    {
      id: 'chart-maps',
      title: 'Reports',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'charts',
          title: 'Monthly Summary',
          type: 'item',
          icon: 'feather icon-user',
          url: '/monthlysummery'
        },
        {
          id: 'charts',
          title: 'Total Summary',
          type: 'item',
          icon: 'feather icon-user',
          url: '/totalsummery'
        },    
             
      ]
    },
    {
      id: 'chart-maps',
      title: 'Logout',
      type: 'group',
      icon: 'icon-charts',
      children: [
      
        {
          id: 'disabled-menu',
          title: 'Logout',
          type: 'item',
          // url: '#',
          // classes: 'nav-item disabled',
          icon: 'feather icon-power',
          url: '/auth/logout',
          // target: true,
          breadcrumbs: false
        }
      ]
    }, 
  ]
};

export default menuItems;
