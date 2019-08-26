import React, { useState } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

export default (props) => {

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const createMessage = () => {
        return {
            content: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: props.currentUser.uid,
                name: props.currentUser.displayName,
                avatar: props.currentUser.photoURL
            }
        }
    }

    const sendMessage = () => {
        const { messagesRef, currentChannel } = props;

        if (message) {
            setLoading(true);
            messagesRef
                .child(currentChannel.id)
                .push()
                .set(createMessage())
                .then(() => {
                    setLoading(false);
                    setMessage('');
                    setErrors([]);
                })
                .catch((error) => {
                    let tempError = [];
                    //console.error(error);
                    setLoading(false);
                    setErrors(tempError.concat(error))
                })
        }
        else {
            setErrors([].concat({ message: "Add a message" }))
        }
    }

    return (
        <Segment className="messages__form">
            <Input
                fluid
                name="message"
                style={{ marginBottom: '0.7em' }}
                label={<Button icon="add" />}
                labelPosition="left"
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={
                    errors.some(err => err.message.includes('message')) ? 'error' : ''
                }
            />
            <Button.Group icon widths="2">
                <Button
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    className={loading ? 'loading' : ''}
                    icon="edit"
                    onClick={sendMessage}
                    disabled={loading}
                />
                <Button
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                />
            </Button.Group>
        </Segment>
    );
}