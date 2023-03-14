import React, {useState} from "react";
import { Menu as MenuIcon, AccountCircle, ExitToApp, PersonAdd, Build, Home, ChromeReaderMode, ContactMail} from '@material-ui/icons';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Hidden ,makeStyles,Paper} from '@material-ui/core';
import { Link } from 'react-router-dom';
function AppLayout(classes:any) {
    return (
       <>
        <MenuItem  className={classes.menuItem} component={Link} to={"/"}>
          <Home /> Accueil
        </MenuItem>
        <MenuItem  className={classes.menuItem} component={Link} to={"/services"}>
        <Build /> Services
        </MenuItem>
        <MenuItem  className={classes.menuItem} component={Link} to={"/blog"}>
         <ChromeReaderMode /> Blog
        </MenuItem>
        <MenuItem  className={classes.menuItem} component={Link} to={"/contact"}>
        <ContactMail /> Contact
        </MenuItem>
       </>
            
    )
  }
interface Menu{
    isConnected : boolean;
    handleConnect: () => void;
    handleDisconnect: () => void;
    handleSign: () => void;
}
const useStyles = makeStyles((theme) => ({
    appBar: {
      backgroundColor: '#fff',
      boxShadow: 'none',
      alignItems: 'center',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '80%',
        margin: '0 auto',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    menu: {
      '& .MuiList-padding': {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    menuItem: {
      padding: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        fontSize: '1.2rem',
      },
    },
    paper: {
        width: '200px',
    },
  }));

const AppBarMenu: React.FC<Menu>= ({isConnected,handleConnect,handleDisconnect,handleSign}) =>{
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    return(
      <div>
        <Hidden mdUp>
            <AppBar position="static" className="classes.appBar">
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu} className={classes.menuButton}>
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    //keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={open}
                    onClose={handleClose}
                    className={classes.menu}
                    >
                    {isConnected ? (
                        <Paper className={classes.paper}>
                            <MenuItem onClick={handleDisconnect} className={classes.menuItem}>
                                <ExitToApp /> Déconnecter
                            </MenuItem>
                            <MenuItem disabled className={classes.menuItem} >
                                <AccountCircle /> Mon Compte
                            </MenuItem>
                            {<AppLayout classes={classes}></AppLayout>}
                        </Paper>
                    ) : (
                        <Paper className={classes.paper}>
                        <MenuItem /*onClick={handleConnect}*/ className={classes.menuItem} component={Link} to={"/login"}>
                            <AccountCircle /> Connexion
                        </MenuItem>
                        <MenuItem className={classes.menuItem}  component={Link} to={"/login"}>
                            <PersonAdd /> S'inscrire
                        </MenuItem >
                        {<AppLayout classes={classes}></AppLayout>}
                        </Paper>
                    )}
                    </Menu>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                         Jeu  Pokémon 
                    </Typography>
                </Toolbar>
                </AppBar>
            </Hidden>
            <Hidden mdDown>
                <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Jeu  Pokémon 
                    </Typography>
                    {isConnected ? (
                    <>
                       {<AppLayout classes={classes}></AppLayout>}
                        <Button color="inherit" startIcon={<ExitToApp />} onClick={handleDisconnect}>
                        Déconnecter
                        </Button>
                        <Button color="inherit" startIcon={<AccountCircle />} disabled>
                        Mon Compte
                        </Button>
                    </>
                    ) : (
                    <>
                        {<AppLayout classes={classes}></AppLayout>}
                        <Button color="inherit" startIcon={<AccountCircle />}  onClick={handleConnect} component={Link} to={"/login"}>
                        Connexion
                        </Button>
                        <Button color="inherit" startIcon={<PersonAdd /> } onClick={handleSign} component={Link} to={"/login"}> 
                        S'inscrire
                        </Button>
                    </>
                    )}
                    </Toolbar>
            </AppBar>
        </Hidden>
      </div>
    )
}

export default AppBarMenu;