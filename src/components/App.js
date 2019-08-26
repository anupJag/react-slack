import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import './App.css';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';


function App() {

  const [userProps, setUserProps] = useState({});

  const userDisplayName = useSelector(state => state.user.currentUser, shallowEqual);

  const currentActiveChannel = useSelector(state => state.channel.currentChannel);

  useEffect(() => {
    setUserProps(userDisplayName);
  }, [userDisplayName]);

  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel
        userProps={userProps}
        key={userProps && userProps.uid}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentActiveChannel && currentActiveChannel.id}
          currentChannel={currentActiveChannel}
          currentUser={userProps}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>

    </Grid>
  );
}

export default App;
