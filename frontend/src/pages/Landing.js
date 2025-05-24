import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>🗳️ Welcome to Poll Voting App</h1>
        <p>Your voice matters — vote on live polls or create your own!</p>
        <div className="landing-buttons">
          <button onClick={() => navigate('/login')} className="landing-btn">Login</button>
          <button onClick={() => navigate('/register')} className="landing-btn">Register</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
