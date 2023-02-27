import React, {useState, useEffect} from "react";
import { Menu as MenuIcon, AccountCircle, ExitToApp, PersonAdd } from '@material-ui/icons';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Hidden } from '@material-ui/core';


interface Menu{
    isConnected : boolean;
    handleConnect: () => void;
    handleDisconnect: () => void;
    handleSign: () => void;
}

const ResponsiveMenu: React.FC<Menu>= ({isConnected,handleConnect,handleDisconnect,handleSign}) =>{

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
        <Hidden smUp>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu}>
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={open}
                    onClose={handleClose}
                    >
                    {isConnected ? (
                        <>
                        <MenuItem onClick={handleDisconnect}>
                            <ExitToApp /> Déconnecter
                        </MenuItem>
                        <MenuItem disabled>
                            <AccountCircle /> Mon Compte
                        </MenuItem>
                        </>
                    ) : (
                        <>
                        <MenuItem onClick={handleConnect}>
                            <AccountCircle /> Connexion
                        </MenuItem>
                        <MenuItem>
                            <PersonAdd /> S'inscrire
                        </MenuItem>
                        </>
                    )}
                    </Menu>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                         Jeu  Pokémon 
                    </Typography>
                </Toolbar>
                </AppBar>
            </Hidden>
            <Hidden xsDown>
                <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Jeu  Pokémon 
                    </Typography>
                    {isConnected ? (
                    <>
                        <Button color="inherit" startIcon={<ExitToApp />} onClick={handleDisconnect}>
                        Déconnecter
                        </Button>
                        <Button color="inherit" startIcon={<AccountCircle />} disabled>
                        Mon Compte
                        </Button>
                    </>
                    ) : (
                    <>
                        <Button color="inherit" startIcon={<AccountCircle />}  onClick={handleConnect}>
                        Connexion
                        </Button>
                        <Button color="inherit" startIcon={<PersonAdd /> } onClick={handleSign}> 
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

export default ResponsiveMenu;