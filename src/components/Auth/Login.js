import React, { useState } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

export default (props) => {

    const [userDetails, setUserDetails] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const { email, password } = userDetails;

    //Update User Details
    const handleChange = event => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value
        });
    }

    const isFormValid = ({ email, password }) => {
        return email.length || password.length;
    }

    //Form Submit handler
    const handleSubmit = event => {
        event.preventDefault();
        if (isFormValid(userDetails)) {
            setErrors([]);
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedInUser => {
                    console.log(signedInUser);
                })
                .catch(err => {
                    console.log(err);
                    let tempError = [];
                    setErrors(tempError.concat(err));
                    setLoading(false);
                })
        }
        else{
            let tempError = {message : 'Fill in the required details'};
            setErrors(errors.concat(tempError))
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
                    color="violet"
                    textAlign="center">
                    <Icon name="cogs" color="violet" />
                    Login to RecChat
                </Header>
                <Form onSubmit={handleSubmit} size="large">
                    <Segment stacked>
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
                            required
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
                            required
                        />
                        <Button
                            color="violet"
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
                <Message warning>Don't have an account? <Link to="/register">Sign Up</Link></Message>
            </Grid.Column>
        </Grid>
    );
};