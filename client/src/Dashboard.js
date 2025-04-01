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
  const [semester, setSemester] = useState('');
  const [classCode, setClassCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [department, setDepartment] = useState('');
    // At the top of your component, declare options:
  const semesterOptions = ["Spring 2024", "Summer 2024", "Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"];
  const departmentOptions = ["Computer Science", "Engineering", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Psychology", "English"];

  const [semesterFilter, setSemesterFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [professorFilter, setProfessorFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

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

  const fetchNotesWithFilters = async () => {
    try {
      const res = await axios.get('/notes', {
        params: {
          semester: semesterFilter,
          department: departmentFilter,
          professor: professorFilter,
          class_code: classFilter
        }
      });
      if (res.data.success) setNotes(res.data.notes);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };
  
  // Reset filter function
  const resetFilters = () => {
    setSemesterFilter('');
    setDepartmentFilter('');
    setProfessorFilter('');
    setClassFilter('');
    fetchNotesWithFilters();
  };
  
  // Initially fetch all notes on load
  useEffect(() => {
    fetchNotesWithFilters();
  }, []);

  
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('email', email);
    formData.append('file', file);
    formData.append('semester', semester);
    formData.append('class_code', classCode);
    formData.append('professor', professor);
    formData.append('department', department);
    
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

        {/* Semester Dropdown */}
        <select value={semester} onChange={e => setSemester(e.target.value)} required>
          <option value="" disabled>Select Semester</option>
          {semesterOptions.map(sem => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        <input type="text" placeholder="Class (e.g., CIS 216)" onChange={e => setClassCode(e.target.value)} required />
        <input type="text" placeholder="Professor" onChange={e => setProfessor(e.target.value)} required />

        {/* Department Dropdown */}
        <select value={department} onChange={e => setDepartment(e.target.value)} required>
          <option value="" disabled>Select Department</option>
          {departmentOptions.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>

        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
        <input type="file" accept=".pdf,.doc,.docx,.png,.jpeg" onChange={e => setFile(e.target.files[0])} required />
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
      <div className="filter-section">
        <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}>
          <option value="">All Semesters</option>
          {semesterOptions.map(sem => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departmentOptions.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>

        <input type="text" placeholder="Professor" value={professorFilter} onChange={e => setProfessorFilter(e.target.value)} />
        <input type="text" placeholder="Class (e.g., CIS 216)" value={classFilter} onChange={e => setClassFilter(e.target.value)} />

        <button onClick={() => fetchNotesWithFilters()}>Search</button>
        <button onClick={() => resetFilters()}>Reset</button>
      </div>

      <h3>Browse Notes</h3>
      <ul className="notes-list">
        {notes.map(note => (
          <li key={note.id} className="note-item">
            <h4>{note.title}</h4>
            <p><strong>Class:</strong> {note.class_code}</p>
            <p><strong>Professor:</strong> {note.professor}</p>
            <p><strong>Semester:</strong> {note.semester}</p>
            <p><strong>Department:</strong> {note.department}</p>
            <p><em>{note.description}</em></p>
            {note.ocr_text && (
              <details>
                <summary><strong>OCR Preview</strong></summary>
                <p>{note.ocr_text.substring(0, 300)}...</p>
              </details>
            )}
            <a href={note.file_url} target="_blank" rel="noopener noreferrer">View File</a>
          </li>
        ))}
      </ul>


    </div>
  );
}

export default Dashboard;