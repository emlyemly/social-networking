import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.getItem('token')) {
    setAuthToken(localStorage.getItem('token'));
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Routes>
                        <Route exact path='/' element={<Landing />} />
                    </Routes>
                    <section className='container'>
                        <Alert />
                        <Routes>
                            <Route
                                exact
                                path='/register'
                                element={<Register />}
                            />
                            <Route exact path='/login' element={<Login />} />
                            <Route
                                path='dashboard'
                                element={<PrivateRoute component={Dashboard} />}
                            />
                            <Route
                                path='profile'
                                element={
                                    <PrivateRoute component={CreateProfile} />
                                }
                            />
                        </Routes>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;