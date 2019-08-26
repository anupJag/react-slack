import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';

const SidePanel = ({ userProps }) => {
    return (
        <Menu
            size="large"
            inverted
            fixed="left"
            vertical
            style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
        >
            <UserPanel
                userProps={userProps}
            />
            <Channels
                userProps={userProps}
            />
        </Menu>
    );
};

export default SidePanel;