import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';

const Messages = ({ currentChannel, currentUser }) => {

    // eslint-disable-next-line no-unused-vars
    const [messagesRef, setMessagesRef] = useState(firebase.database().ref('messages'));


    const addListners = (channelId) => {
        
    }

    useEffect(() => {
        if (currentChannel && currentUser) {
            addListners(currentChannel.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <MessagesHeader />

            <Segment>
                <Comment.Group className="messages">

                </Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={messagesRef}
                currentChannel={currentChannel}
                currentUser={currentUser}
            />
        </React.Fragment>
    );
};

export default Messages;