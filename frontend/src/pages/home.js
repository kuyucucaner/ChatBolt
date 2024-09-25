import React from 'react';
import Chatbot from '../components/chatbot-form';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Chat<b>BOLT</b>! </h1>
      <Chatbot />
    </div>
  );
};

export default Home;
