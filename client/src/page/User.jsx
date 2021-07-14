import React from 'react';
// import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
// import Home from './Home';
// import Header from '../components/Header';
const Header = React.lazy(() => import('../components/Header'));
const Home = React.lazy(() => import('./Home'));

function User(props) {

    // const auth = useSelector(state => state.auth);
    // const { isLogger, isAdmin } = auth
    return (
        <div>
            <Header></Header>
            <div className="home-page">
                <Home></Home>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default User;