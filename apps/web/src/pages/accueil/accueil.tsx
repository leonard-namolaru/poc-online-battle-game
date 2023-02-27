import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Hidden } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle, ExitToApp, PersonAdd } from '@material-ui/icons';
import React, { useState } from 'react';
import ResponsiveMenu from './menu';
import Footer from './footer';
import AdCarousel from './carousel';

interface User {
  id: number;
  name: string;
  image: string;
}
const Homepage: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);


  const handleConnect = () => {
    // Code to handle user authentication and set isConnected and userInfo
  };

  const handleDisconnect = () => {
    // Code to handle user logout and reset isConnected and userInfo
  };

  const Sign = () =>{
    // 
  }

  return (
    <div style={{display: "flex", flexDirection: "column",minHeight: "100vh",}}>

       <header style={{ height: "60px" }} >{ <ResponsiveMenu  isConnected={isConnected} handleConnect={handleConnect} handleDisconnect={handleDisconnect} handleSign={Sign}/>} </header>

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

        {<Footer Address='20 rue ismail' Email='ismail' Name='pokemos ' Phone='+25364216841265' 
           facebookUrl="https://facebook.com"
           twitterUrl="https://twitter.com"
           instagramUrl="https://instagram.com"
           linkedInUrl="https://linked.com"
        />}
  </div>
);
};

export default Homepage;
