// import { useEffect, useState } from 'react';
// import API from '../services/api';
// import { useNavigate } from 'react-router-dom';
// import { Bar } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

// const Dashboard = () => {
//   const [polls, setPolls] = useState([]);
//   const role = localStorage.getItem('role');
//   const navigate = useNavigate();

//   const fetchPolls = async () => {
//     const res = await API.get('/polls');
//     setPolls(res.data);
//   };

//   const vote = async (pollId, index) => {
//     try {
//       await API.post(`/polls/${pollId}/vote`, { optionIndex: index });
//       fetchPolls();
//     } catch {
//       alert('Already voted or expired!');
//     }
//   };

//   const deletePoll = async (id) => {
//     await API.delete(`/polls/${id}`);
//     fetchPolls();
//   };

//   useEffect(() => {
//     fetchPolls();
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">{role === 'admin' ? 'Admin' : 'User'} Dashboard</h2>
//       {role === 'admin' && (
//         <button
//           className="create-poll-btn"
//           onClick={() => navigate('/create')}
//         >
//           Create Poll
//         </button>
//       )}

//       <div className="polls-list">
//         {polls.map((p) => (
//           <div key={p._id} className="poll-card">
//             <h4 className="poll-question">{p.question}</h4>
//             {new Date() > new Date(p.expiresAt) ? (
//               <Bar
//                 data={{
//                   labels: p.options.map((o) => o.text),
//                   datasets: [
//                     {
//                       label: 'Votes',
//                       data: p.options.map((o) => o.votes),
//                       backgroundColor: 'rgba(75,192,192,0.6)',
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                 }}
//                 height={200}
//               />
//             ) : role === 'user' ? (
//               <div className="poll-options">
//                 {p.options.map((o, i) => (
//                   <button
//                     key={i}
//                     className="option-btn"
//                     onClick={() => vote(p._id, i)}
//                   >
//                     {o.text}
//                   </button>
//                 ))}
//               </div>
//             ) : null}
//             {role === 'admin' && (
//               <button
//                 onClick={() => deletePoll(p._id)}
//                 className="delete-poll-btn"
//               >
//                 Delete Poll
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchPolls = async () => {
    const res = await API.get('/polls');
    setPolls(res.data);
  };

  const vote = async (pollId, index) => {
    try {
      await API.post(`/polls/${pollId}/vote`, { optionIndex: index });
      fetchPolls();
    } catch {
      alert('Already voted or expired!');
    }
  };

  const deletePoll = async (id) => {
    await API.delete(`/polls/${id}`);
    fetchPolls();
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">{role === 'admin' ? 'Admin' : 'User'} Dashboard</h2>

      {role === 'admin' && (
        <button className="create-poll-btn" onClick={() => navigate('/create')}>
          Create Poll
        </button>
      )}

      <div className="polls-list">
        {polls.map((p) => (
          <div key={p._id} className="poll-card">
            <h4 className="poll-question">{p.question}</h4>

            {new Date() > new Date(p.expiresAt) ? (
              <div style={{ width: '400px', height: '300px', margin: 'auto' }}>
                <Bar
                  data={{
                    labels: p.options.map((o) => o.text),
                    datasets: [
                      {
                        label: 'Votes',
                        data: p.options.map((o) => o.votes),
                        backgroundColor: 'rgba(75,192,192,0.6)',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            ) : role === 'user' ? (
              <div className="poll-options">
                {p.options.map((o, i) => (
                  <button
                    key={i}
                    className="option-btn"
                    onClick={() => vote(p._id, i)}
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            ) : null}

            {role === 'admin' && (
              <button className="delete-poll-btn" onClick={() => deletePoll(p._id)}>
                Delete Poll
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
