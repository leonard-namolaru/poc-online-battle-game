import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Menu, MenuItem, ListSubheader, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(true);

  useEffect(() => {
    const updateIsSmallScreen = () => {
     // setIsSmallScreen(window.innerWidth <= 600);
    };
    updateIsSmallScreen();
    window.addEventListener("resize", updateIsSmallScreen);
    return () => window.removeEventListener("resize", updateIsSmallScreen);
  }, []);

  return isSmallScreen ? (
    <List component="nav" aria-label="menu items" className={classes.root}>
      {menuItems.map((item) => (
        'subItems' in item ? (
          <List key={item.label} subheader={<ListSubheader>{item.label}</ListSubheader>}>
            {item.subItems.map((subItem) => (
              <ListItem button key={subItem.label} className={classes.listItem} component={Link} to={subItem.path}>
                <ListItemText primary={subItem.label} />
              </ListItem>
            ))}
          </List>
        ) : (
          <ListItem button key={item.label} className={classes.listItem} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        )
      ))}
    </List>
  ) : (
    <>
      <Button aria-controls="menu" aria-haspopup="true" onClick={handleClick} className={classes.button}>
        <MenuIcon /> Menu
      </Button>
      <Menu id="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems.map((item) => (
          'subItems' in item ? (
            <MenuItem key={item.label} disabled>
              {item.label}
            </MenuItem>
          ) : (
            <MenuItem key={item.label} onClick={handleClose}>
              {item.label}
            </MenuItem>
          )
        ))}
      </Menu>
    </>
  );
};

export default ResponsiveMenu;
