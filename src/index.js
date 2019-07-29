import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import 'semantic-ui-css/semantic.min.css';
import firebase from 'firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser } from './actions';
import Spinner from  './Spinner';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {

    componentDidMount() {
        console.log(this.props.isLoading);
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user);
                this.props.history.push('/');
            }
        })
    }

    render() {
        return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route path="/" component={App} exact />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        )
    }
};

const mapStateToProps = (state) => ({
    isLoading : state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser })(Root));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <RootWithAuth />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));