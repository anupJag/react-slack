import React, { useState } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

export default (props) => {

    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [userRef, setUserRef] = useState(firebase.database().ref(`users`));

    const { username, email, password, passwordConfirmation } = userDetails;

    //Checking to see if Form inputs are not empty
    const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }

    //Checking to see if password is valid
    const isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        }
        else if (password !== passwordConfirmation) {
            return false;
        }
        else {
            return true;
        }
    }

    //Form validation
    const isFormValid = () => {

        let tempErrors = [];
        let tempError;

        if (isFormEmpty(userDetails)) {
            //throw error form empty
            tempError = { message: "Fill in all fields" };
            setErrors(tempErrors.concat(tempError));
            return false;
        }
        else if (!isPasswordValid(userDetails)) {
            //throw error
            tempError = { message: "Password is invalid" };
            setErrors(tempErrors.concat(tempError));
            return false;
        }
        else {
            return true;
        }
    }

    //Update User Details
    const handleChange = event => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value
        });
    }

    const saveUser = createdUser => {
        return userRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    //Form Submit handler
    const handleSubmit = event => {
        event.preventDefault();
        if (isFormValid()) {
            setErrors([]);
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user.updateProfile({
                        displayName: username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                        .then(() => {
                            saveUser(createdUser).then(() => {
                                console.log(`User Saved`);
                                setLoading(false);
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            setErrors(errors.concat(err));
                            setLoading(false);
                        })
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                    setErrors(errors.concat(error));
                });
        }
    }

    const handleInputError = (errors, inputName) => {
        return errors.some(err => err.message.toLowerCase().includes(inputName)) ? "error" : ""
    }

    //Show Error message
    const displayError = (error) => (error.map((err, i) => <p key={i}>{err.message}</p>));

    //console.log(errors);

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header
                    as="h1"
                    icon
                    color="orange"
                    textAlign="center">
                    <Icon name="houzz" color="orange" />
                    Register for RecChat
                </Header>
                <Form onSubmit={handleSubmit} size="large">
                    <Segment stacked>
                        <Form.Input
                            fluid
                            name="username"
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            type="text"
                            onChange={handleChange}
                            value={username}
                        />

                        <Form.Input
                            fluid
                            name="email"
                            icon="at"
                            iconPosition="left"
                            placeholder="Email Address"
                            type="email"
                            onChange={handleChange}
                            value={email}
                            className={handleInputError(errors, "email")}
                        />

                        <Form.Input
                            fluid
                            name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            type="password"
                            onChange={handleChange}
                            value={password}
                            className={handleInputError(errors, "password")}
                        />

                        <Form.Input
                            fluid
                            name="passwordConfirmation"
                            icon="repeat"
                            iconPosition="left"
                            placeholder="Password Confirmation" type="password"
                            onChange={handleChange}
                            value={passwordConfirmation}
                            className={handleInputError(errors, "password")}
                        />
                        <Button
                            color="orange"
                            fluid
                            size="large"
                            className={loading ? 'loading' : ''}
                            disabled={loading}
                        >Submit</Button>
                    </Segment>
                </Form>
                {
                    errors && errors.length > 0 ?
                        <Message error>
                            <Message.Header>Error</Message.Header>
                            {
                                displayError(errors)
                            }
                        </Message> : null
                }
                <Message warning>Already a user? <Link to="/login">Login</Link></Message>
            </Grid.Column>
        </Grid>
    );
};