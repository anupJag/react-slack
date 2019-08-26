/* eslint-disable react-hooks/exhaustive-deps */
import React, { useReducer, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../actions/';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Button } from 'semantic-ui-react';

const rootReducer = (state, action) => {

    switch (action.type) {
        case "MODAL_OPEN":
            return {
                ...state,
                modalOpen: true
            }
        case "MODAL_CLOSE":
            return {
                ...state,
                modalOpen: false,
                channelName: '',
                channelDetails: ''
            }
        case "CHANNEL_FIELD":
            return {
                ...state,
                [action.fieldName]: action.value
            }
        case "CHANNEL_ADDED":
            return {
                ...state,
                modalOpen: false,
                channelName: '',
                channelDetails: ''
            }
        case "CHANNEL_DATA":
            return {
                ...state,
                channels: [...action.channels]
            }
        case "ACTIVE_CHANNEL":
            return {
                ...state,
                activeChannel: action.value
            }
        default:
            return state;
    }
}

const initialState = {
    channels: [],
    modalOpen: false,
    channelName: '',
    channelDetails: '',
    activeChannel: ''
}


export default ({ userProps }) => {

    // eslint-disable-next-line
    const [channelsRef, setChannelsRef] = useState(firebase.database().ref('channels'));

    const [firstLoad, setFirstLoad] = useState(true);

    const globalDispatch = useDispatch();

    const [channelDetail, dispatch] = useReducer(rootReducer, initialState);

    const { channels, modalOpen, channelName, channelDetails, activeChannel } = channelDetail;

    const setFirstChannel = () => {
        if (firstLoad && channels.length > 0) {
            console.log(`I was called`);
            globalDispatch(setCurrentChannel(channels[0]));
            setActiveChannel(channels[0]);
            setFirstLoad(false);
        }
    }

    useEffect(() => {
        let tempChannels = [];
        channelsRef.on('child_added', snap => {
            tempChannels.push(snap.val());
            dispatch({
                type: "CHANNEL_DATA",
                channels: tempChannels
            });
        });

        return () => {
            console.log("Removing Listeners");
            channelsRef.off();
        }
    }, []);

    useEffect(() => {
        setFirstChannel();
    }, [channels]);


    const addChannel = () => {
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: userProps.displayName,
                avatar: userProps.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                dispatch({
                    type: "CHANNEL_ADDED"
                });
                console.log("Channel Added");
            })
            .catch((err) => {
                console.log(err)
            })
    }


    const channelFormIsValid = (name, details) => name && details;

    const channelCreateSubmit = () => {
        if (channelFormIsValid(channelName, channelDetails)) {
            addChannel();
        }
        else {
            console.log('You are either missing the Channel Name or About the Channel')
        }
    }

    const setActiveChannel = (channel) => {
        dispatch({
            type: "ACTIVE_CHANNEL",
            value: channel.id
        });
    }

    const changeChannelHanlder = channel => {
        //DO SOMETHING HERE
        setActiveChannel(channel);
        globalDispatch(setCurrentChannel(channel));
    }

    return (
        <React.Fragment>
            <Menu.Menu style={{ paddingBottom: '2em' }}>
                <Menu.Item>
                    <span style={{ marginRight: '2pt' }}>
                        <Icon name="exchange" /> CHANNELS
                </span>
                    ({channels.length}) <Icon style={{ cursor: "pointer" }} name="add" onClick={() => dispatch({ type: "MODAL_OPEN" })} />
                </Menu.Item>
                {
                    channels && channels.length > 0 ?
                        channels.map(el =>
                            <Menu.Item
                                key={el.id}
                                onClick={() => changeChannelHanlder(el)}
                                name={el.name}
                                style={{ opacity: 0.7 }}
                                active={el.id === activeChannel}
                            >
                                # {el.name}
                            </Menu.Item>
                        )
                        :
                        null
                }
            </Menu.Menu>

            <Modal size="large" open={modalOpen}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={channelCreateSubmit}>
                        <Form.Field>
                            <Form.Input
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                value={channelName}
                                onChange={(e) => dispatch({
                                    type: "CHANNEL_FIELD",
                                    fieldName: e.currentTarget.name,
                                    value: e.currentTarget.value
                                })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input
                                fluid
                                label="About the Channel"
                                name="channelDetails"
                                value={channelDetails}
                                onChange={(e) => dispatch({
                                    type: "CHANNEL_FIELD",
                                    fieldName: e.currentTarget.name,
                                    value: e.currentTarget.value
                                })}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color="green" inverted onClick={channelCreateSubmit}>
                        <Icon name="checkmark" /> Add
                </Button>
                    <Button color="red" inverted onClick={() => dispatch({ type: 'MODAL_CLOSE' })}>
                        <Icon name="remove" /> Cancel
                </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    );
}