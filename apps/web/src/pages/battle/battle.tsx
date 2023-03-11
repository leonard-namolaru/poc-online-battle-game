import React, { useState } from 'react';
import AppBarMenu from '../accueil/AppBar';
import Footer from '../accueil/footer';
import AdCarousel from '../accueil/carousel';
import ResponsiveMenu from '../menu/menu';
import { Outlet} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Hidden } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle, ExitToApp, PersonAdd } from '@material-ui/icons';

interface User {
  id: number;
  name: string;
  image: string;
}
function AppLayout() {
  const menuItems = [
      // { label: 'Accueil', path: '/' },
      // { label: 'Création de pokemon', path: '/pokemon' },
      // { label: 'Dresseurs', path: '/trainer' },
      { label: 'Accueil', path: '/' , color : "#F7E7CE"},
      { label: 'Services', path: '/services', color : "#8A6BBE" },
      { label: 'Blog', path: '/blog', color : "#98C1D9" },
      { label: 'Contact', path: '/contact', color : "#A7E9AF" },
      
    ];
  return (
     
      <>
          <ResponsiveMenu menuItems={menuItems} />
          <Outlet />
      </>

          
  )
}
const Homepage: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);


  const handleConnect = () => {
    // Code to handle user authentication and set isConnected and userInfo
    // Cauthentication,  set isConnected and userInfo
  };

  const handleDisconnect = () => {
  	// Code to handle user logout and reset isConnected and userInfo
    // user logout, reset isConnected and userInfo
  };

  const Sign = () =>{
    // 
  }

  return (
    <div style={{display: "flex", flexDirection: "column",minHeight: "100vh",}}>

       <header style={{ height: "60px" }} >
        {<AppLayout />}
        { <AppBarMenu  isConnected={isConnected} handleConnect={handleConnect} handleDisconnect={handleDisconnect} handleSign={Sign}/>}  
      </header>

       <main style={{ flexGrow: 1 }}>
            {isConnected ? (
              <div>
                <Typography variant="h4">Welcome, {userInfo?.name}!</Typography>
                {/* Code for user management form */}
              </div>
            ) : (
              <div>
                {<AdCarousel/>}
              </div>
            )}
        </main>

        {<Footer Address='5, rue Thomas Mann 75013 PARIS' Email='@pokemons' Name='pokemos ' Phone='+3310568971' 
           facebookUrl="https://facebook.com"
           twitterUrl="https://twitter.com"
           instagramUrl="https://instagram.com"
           linkedInUrl="https://linked.com"
        />}
  </div>
);
};

export default Homepage;
