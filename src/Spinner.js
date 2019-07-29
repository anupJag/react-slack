import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

export default () => (
    <Dimmer active>
        <Loader
            size="huge"
            content="Preparing Chat"
        />
    </Dimmer>
);