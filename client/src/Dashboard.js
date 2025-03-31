import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ name, email, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/notes');
      if (res.data.success) setNotes(res.data.notes);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('email', email);
    formData.append('file', file);

    try {
      const res = await axios.post('/upload-note', formData);
      setUploadMsg(res.data.message);
      setTitle('');
      setSubject('');
      setDescription('');
      setFile(null);
      fetchNotes();
    } catch (err) {
      setUploadMsg('Upload failed');
    }
  };

  return (
    <div className="dashboard">
      <button className="logout-btn" onClick={onLogout}>Log Out</button>

      <div className="header-logos">
        <img src="/images/spelman-college.svg" alt="Spelman Logo" className="logo" />
        <img src="/images/headerSmallLogo221221104236.jpeg" alt="Morehouse Logo" className="logo" />
      </div>

      <h2>Welcome to SpelHouse Study Swap</h2>
      <p>Share and access class notes with fellow Spelman and Morehouse students.</p>
      <p>Hello, {name}! You logged in with {email}.</p>

      <h3>Upload Notes</h3>
      <form onSubmit={handleUpload} encType="multipart/form-data" className="upload-form">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
      {uploadMsg && <p className="upload-msg">{uploadMsg}</p>}

      <div className="card-section">
        <div className="card">
          <h4>Recently Added Notes</h4>
          <p>{notes.length} this week</p>
        </div>
        <div className="card">
          <h4>Top Courses</h4>
          <button onClick={() => alert('Coming soon!')}>Browse by course</button>
        </div>
      </div>

      <h3>Browse Notes</h3>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            <strong>{note.title}</strong> - {note.subject}<br />
            <em>{note.description}</em><br />
            <a href={note.file_url} target="_blank" rel="noopener noreferrer">View File</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;