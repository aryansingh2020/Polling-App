import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState('');
  const navigate = useNavigate();

  const addOption = () => setOptions([...options, '']);
  const handleChange = (i, value) => {
    const copy = [...options];
    copy[i] = value;
    setOptions(copy);
  };

  const createPoll = async () => {
    await API.post('/polls', { question, options, expiresAt });
    navigate('/dashboard');
  };

  return (
    <div className="createpoll-container">
      <h2 className="title">Create Poll</h2>

      <input
        className="input-field"
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          className="input-field"
          type="text"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={e => handleChange(i, e.target.value)}
        />
      ))}

      <button className="add-option-btn" onClick={addOption}>
        + Add Option
      </button>

      <label className="label" htmlFor="expiresAt">Poll Expiration Date & Time</label>
      <input
        className="input-field"
        type="datetime-local"
        id="expiresAt"
        value={expiresAt}
        onChange={e => setExpiresAt(e.target.value)}
      />

      <button className="create-btn" onClick={createPoll}>
        Create Poll
      </button>
    </div>
  );
};

export default CreatePoll;
