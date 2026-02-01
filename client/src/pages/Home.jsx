


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Hero from '../components/Hero'; 
import SpotlightSection from '../components/SpotlightSection';
import Options from '../components/Options';
import StrokeText from '../components/StrokeText';
import LeaderBoard from '../components/LeaderBoard'; 
import Chat from '../pages/Chat';

function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/auth';
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:7000/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // console.log(response.data);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data. Please try again.');
                setLoading(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth';
            }
        };

        fetchUserData();
    }, [navigate]);

    // Don't render anything if there's no token
    if (!localStorage.getItem('token')) {
        return null;
    }

     
    return (
        <div> 
            <Hero user={user}/>
            <Options />
            <SpotlightSection />
            <StrokeText /> 
            {/* <Chat/> */}
        </div>
    );
}

export default Home;
