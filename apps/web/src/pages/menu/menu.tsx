import React from 'react';
import { List, ListItem, ListItemText, MenuItem, ListSubheader, makeStyles, Hidden } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
  color: string;
}

interface MenuItemWithSubmenu extends MenuItem {
  subItems: MenuItem[];
}

interface MenuProps {
  menuItems: (MenuItem | MenuItemWithSubmenu)[];
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0 16px',
    borderBottom: '2px solid transparent',
    transition: 'border-bottom-color 0.2s',
    '&:hover': {
      borderBottomColor: 'black',
    },
  },
  button: {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
});

const ResponsiveMenu: React.FC<MenuProps> = ({ menuItems }) => {
  const classes = useStyles();

  return (
    <Hidden xsDown>
      <List component="nav" aria-label="menu items" className={classes.root}>
        {menuItems.map((item) => (
            <ListItem button key={item.label} className={classes.listItem}  style={{ backgroundColor: item.color}}component={Link} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItem>
        ))}
      </List>
   </Hidden>
  );
};

export default ResponsiveMenu;
