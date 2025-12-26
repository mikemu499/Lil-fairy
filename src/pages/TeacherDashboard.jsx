import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load classes from local storage or API
    const savedClasses = JSON.parse(localStorage.getItem('lilFairyClasses')) || [];
    setClasses(savedClasses);
    setLoading(false);
  }, []);

  const createClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass = {
      id: Date.now().toString(),
      name: newClassName,
      students: [],
      tasks: [],
      createdAt: new Date().toISOString()
    };

    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    localStorage.setItem('lilFairyClasses', JSON.stringify(updatedClasses));
    
    setNewClassName('');
    setShowCreateClass(false);
    setCurrentClass(newClass);
  };

  const openClass = (classObj) => {
    setCurrentClass(classObj);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo"> fairy</div>
            <h1>Teacher Dashboard</h1>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => setShowCreateClass(true)}>
              + New Class
            </button>
            <div className="user-menu">
              <span>Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="classes-section">
            <h3>Your Classes</h3>
            <div className="classes-list">
              {classes.map((classObj) => (
                <div 
                  key={classObj.id} 
                  className={`class-item ${currentClass?.id === classObj.id ? 'active' : ''}`}
                  onClick={() => openClass(classObj)}
                >
                  <span className="class-name">{classObj.name}</span>
                  <span className="class-stats">
                    {classObj.students?.length || 0} students
                  </span>
                </div>
              ))}
            </div>
            {classes.length === 0 && (
              <p className="no-classes">No classes yet. Create your first class!</p>
            )}
          </div>

          <div className="sidebar-actions">
            <button 
              className="btn-primary full-width"
              onClick={() => setShowCreateClass(true)}
            >
              + Add New Class
            </button>
            <button className="btn-secondary full-width">
              📊 Reports
            </button>
            <button className="btn-secondary full-width">
              🎮 Games
            </button>
          </div>
        </aside>

        <main className="main-content">
          {currentClass ? (
            <div className="class-details">
              <div className="class-header">
                <h2>{currentClass.name}</h2>
                <div className="class-stats">
                  {currentClass.students?.length || 0} students
                </div>
              </div>

              <div className="class-actions">
                <button className="btn-primary">Add Students</button>
                <button className="btn-secondary">Add Tasks</button>
                <button className="btn-secondary">View Reports</button>
              </div>

              <div className="students-section">
                <h3>Students</h3>
                {currentClass.students && currentClass.students.length > 0 ? (
                  <div className="students-grid">
                    {currentClass.students.map((student) => (
                      <div key={student.id} className="student-card">
                        <div className="student-name">{student.name}</div>
                        <div className="student-points">
                          ⭐ {student.total || 0} points
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No students added yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="welcome-section">
              <h2>Welcome to Lil Fairy!</h2>
              <p>Select a class from the sidebar or create a new one to get started.</p>
              <button 
                className="btn-primary" 
                onClick={() => setShowCreateClass(true)}
              >
                Create Your First Class
              </button>
            </div>
          )}
        </main>
      </div>

      {showCreateClass && (
        <div className="modal-backdrop" onClick={() => setShowCreateClass(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Class</h3>
            <form onSubmit={createClass}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Class name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateClass(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;