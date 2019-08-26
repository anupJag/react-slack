import React from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

const UserPanel = ({ userProps }) => {

    const userSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('Signed Out'));
    }


    const getDropDownOptions = () => {
        return [
            {
                key: "user",
                text: <span>Signed in as <strong>{userProps.displayName}</strong></span>,
                disabled: true
            },
            {
                key: "avatar",
                text: <span>Change Avatar</span>
            },
            {
                key: "signout",
                text: <span onClick={userSignOut}>Sign Out</span>
            }
        ];
    }

    return (
        <Grid style={{ background: "#4c3c4c" }}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
                    <Header inverted floated="left" as="h2">
                        <Icon name="google wallet" />
                        <Header.Content>RecChat</Header.Content>
                    </Header>
                    <Header style={{ padding: '0.25rem' }} as="h4" inverted>
                        <Dropdown
                            trigger={
                                <span>
                                    <Image
                                        src={userProps.photoURL}
                                        spaced="right"
                                        avatar
                                    />
                                    {userProps.displayName}
                                </span>
                            }
                            options={getDropDownOptions()}
                        />
                    </Header>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    );
};

export default UserPanel;
