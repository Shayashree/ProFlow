// ==========================================================================
// ProFlow Application Logic & State Management
// ==========================================================================

// Global state variables
let appState = {
  teams: [],
  notifications: [],
  activeRole: 'student', // 'student' | 'guide' | 'hod'
  selectedGuideTeamIndex: 0 // Index of selected team in Guide view
};

// Constant keys for localStorage
const STORAGE_KEY = 'proflow_data_v1';

// Default mock data initialization
function getInitialMockData() {
  const teams = [
    {
      id: 'team-a',
      name: 'Team Alpha',
      project: 'IoT Based Smart Irrigation System',
      department: 'AI & DS',
      guide: 'Dr. A. M. Abirami',
      progress: 65,
      approvalStatus: 'Pending Review', // 'Approved' | 'Pending Review' | 'Changes Requested'
      members: [
        { name: 'Adhithya', role: 'Leader' },
        { name: 'Balaji', role: 'Member' },
        { name: 'Chandran', role: 'Member' }
      ],
      logs: [
        { date: '2026-07-03', member: 'Adhithya', hours: 4, desc: 'Configured ESP32 board and tested soil moisture sensor readings.' },
        { date: '2026-07-03', member: 'Balaji', hours: 3, desc: 'Created initial mockups for mobile app interface.' },
        { date: '2026-07-02', member: 'Chandran', hours: 5, desc: 'Set up node-red backend and MongoDB database locally.' },
        { date: '2026-07-01', member: 'Adhithya', hours: 2, desc: 'Reviewed feedback on SRS document and updated sections.' }
      ],
      files: [
        { name: 'Synopsis_Smart_Irrigation.pdf', size: '1.2 MB', type: 'PDF', status: 'Approved', uploadedBy: 'Adhithya', timestamp: '2026-06-15 10:30' },
        { name: 'SRS_Document_Draft.pdf', size: '2.4 MB', type: 'PDF', status: 'Approved', uploadedBy: 'Balaji', timestamp: '2026-06-25 14:15' },
        { name: 'Circuit_Schematics.png', size: '850 KB', type: 'Image', status: 'Pending', uploadedBy: 'Adhithya', timestamp: '2026-07-03 16:40' }
      ],
      doubts: [
        { id: 1, title: 'Calibrating YL-69 moisture sensor outputs', status: 'resolved', raisedBy: 'Adhithya', reply: 'Refer to datasheet table 3 for voltage-to-moisture ratios. Code updated on GitHub.', resolvedBy: 'Dr. A. M. Abirami' },
        { id: 2, title: 'Firebase connection dropping on ESP32 sleep cycle', status: 'open', raisedBy: 'Chandran', reply: '', resolvedBy: '' }
      ],
      meetings: [
        { date: '2026-06-20', time: '14:30', agenda: 'Synopsis Review and Approval', minutes: 'Discussed the overall architecture. Guide advised using WiFi instead of Lora due to cost constraints. Action: Adhithya to update budget sheet.' },
        { date: '2026-07-01', time: '11:00', agenda: 'SRS Verification', minutes: 'Reviewed module partitions. Approved sensor flow diagrams. Balaji to finish app mockups by end of week.' }
      ],
      milestones: [
        { id: 1, title: 'Synopsis Submission', status: 'Approved', date: '2026-06-18' },
        { id: 2, title: 'SRS & System Architecture', status: 'Approved', date: '2026-06-28' },
        { id: 3, title: 'Mid-Term Prototype Demo', status: 'Pending', date: '2026-07-15' },
        { id: 4, title: 'Final Viva & Deployment', status: 'Pending', date: '2026-08-10' }
      ]
    },
    {
      id: 'team-b',
      name: 'Team Beta',
      project: 'AI-Powered Plagiarism Detector',
      department: 'AI & DS',
      guide: 'Dr. A. M. Abirami',
      progress: 40,
      approvalStatus: 'Changes Requested',
      members: [
        { name: 'Divya', role: 'Leader' },
        { name: 'Elango', role: 'Member' },
        { name: 'Gokul', role: 'Member' }
      ],
      logs: [
        { date: '2026-07-03', member: 'Divya', hours: 4.5, desc: 'Trained Cosine Similarity model on NLTK corpus dataset.' },
        { date: '2026-07-02', member: 'Elango', hours: 2, desc: 'Fitted web crawler script to scrape reference documents.' }
      ],
      files: [
        { name: 'Architecture_Layout_v1.pdf', size: '3.1 MB', type: 'PDF', status: 'Approved', uploadedBy: 'Divya', timestamp: '2026-06-20 09:00' },
        { name: 'Model_Training_Report.pdf', size: '1.8 MB', type: 'PDF', status: 'Rejected', uploadedBy: 'Elango', timestamp: '2026-07-02 11:30' }
      ],
      doubts: [
        { id: 1, title: 'TF-IDF matrix memory overflow on large files', status: 'open', raisedBy: 'Divya', reply: '', resolvedBy: '' }
      ],
      meetings: [
        { date: '2026-06-22', time: '15:00', agenda: 'Project Scope Definition', minutes: 'Determined boundaries of scraping. Decided to stick to scholarly papers rather than general web text.' }
      ],
      milestones: [
        { id: 1, title: 'Synopsis Submission', status: 'Approved', date: '2026-06-20' },
        { id: 2, title: 'SRS & System Architecture', status: 'Pending', date: '2026-07-08' },
        { id: 3, title: 'Mid-Term Prototype Demo', status: 'Pending', date: '2026-07-20' },
        { id: 4, title: 'Final Viva & Deployment', status: 'Pending', date: '2026-08-15' }
      ]
    },
    {
      id: 'team-c',
      name: 'Team Gamma',
      project: 'Blockchain Secure E-Voting System',
      department: 'CSE (AIML)',
      guide: 'Prof. C. Sridharan',
      progress: 80,
      approvalStatus: 'Approved',
      members: [
        { name: 'Ganesh', role: 'Leader' },
        { name: 'Harish', role: 'Member' },
        { name: 'Induja', role: 'Member' }
      ],
      logs: [
        { date: '2026-07-03', member: 'Ganesh', hours: 6, desc: 'Deployed voting smart contract on Ethereum testnet.' },
        { date: '2026-07-03', member: 'Harish', hours: 4, desc: 'Created user authentication dashboard using MetaMask integrations.' }
      ],
      files: [
        { name: 'SmartContract_Audited.pdf', size: '4.5 MB', type: 'PDF', status: 'Approved', uploadedBy: 'Ganesh', timestamp: '2026-06-30 18:20' }
      ],
      doubts: [],
      meetings: [
        { date: '2026-06-15', time: '10:00', agenda: 'Introductory & Smart Contracts', minutes: 'Discussed gas optimization techniques for voting transactions.' }
      ],
      milestones: [
        { id: 1, title: 'Synopsis Submission', status: 'Approved', date: '2026-06-12' },
        { id: 2, title: 'SRS & System Architecture', status: 'Approved', date: '2026-06-22' },
        { id: 3, title: 'Mid-Term Prototype Demo', status: 'Approved', date: '2026-07-02' },
        { id: 4, title: 'Final Viva & Deployment', status: 'Pending', date: '2026-08-01' }
      ]
    },
    {
      id: 'team-d',
      name: 'Team Delta',
      project: 'Autonomous Delivery Drone Pathfinding',
      department: 'M.Tech AI',
      guide: 'Dr. P. Chitra',
      progress: 25,
      approvalStatus: 'Pending Review',
      members: [
        { name: 'Jayanth', role: 'Leader' },
        { name: 'Kavin', role: 'Member' },
        { name: 'Loganathan', role: 'Member' }
      ],
      logs: [
        { date: '2026-06-30', member: 'Jayanth', hours: 2, desc: 'Purchased quadcopter chassis framework.' }
      ],
      files: [
        { name: 'Hardware_Specifications.pdf', size: '3.9 MB', type: 'PDF', status: 'Pending', uploadedBy: 'Jayanth', timestamp: '2026-06-29 12:00' }
      ],
      doubts: [
        { id: 1, title: 'GPS module communication failure over I2C', status: 'open', raisedBy: 'Kavin', reply: '', resolvedBy: '' }
      ],
      meetings: [],
      milestones: [
        { id: 1, title: 'Synopsis Submission', status: 'Pending', date: '2026-07-05' },
        { id: 2, title: 'SRS & System Architecture', status: 'Pending', date: '2026-07-18' },
        { id: 3, title: 'Mid-Term Prototype Demo', status: 'Pending', date: '2026-08-05' },
        { id: 4, title: 'Final Viva & Deployment', status: 'Pending', date: '2026-08-25' }
      ]
    },
    {
      id: 'team-e',
      name: 'Team Epsilon',
      project: 'AR Campus Navigation Mobile App',
      department: 'AI & DS',
      guide: 'Dr. A. M. Abirami',
      progress: 90,
      approvalStatus: 'Approved',
      members: [
        { name: 'Manoj', role: 'Leader' },
        { name: 'Nithya', role: 'Member' },
        { name: 'Oviya', role: 'Member' }
      ],
      logs: [
        { date: '2026-07-03', member: 'Manoj', hours: 5, desc: 'Optimized 3D rendering pipeline for campus nodes.' },
        { date: '2026-07-02', member: 'Nithya', hours: 4, desc: 'Tested pathfinding routing with GPS overlays inside building corridor.' }
      ],
      files: [
        { name: 'Campus_3D_Models_Pack.zip', size: '18.5 MB', type: 'Archive', status: 'Approved', uploadedBy: 'Manoj', timestamp: '2026-06-28 15:40' }
      ],
      doubts: [],
      meetings: [
        { date: '2026-06-10', time: '11:00', agenda: 'Initial Design', minutes: 'Discussed Unity vs WebXR. Guide approved Unity AR Foundation due to robust tracking.' }
      ],
      milestones: [
        { id: 1, title: 'Synopsis Submission', status: 'Approved', date: '2026-06-10' },
        { id: 2, title: 'SRS & System Architecture', status: 'Approved', date: '2026-06-20' },
        { id: 3, title: 'Mid-Term Prototype Demo', status: 'Approved', date: '2026-06-30' },
        { id: 4, title: 'Final Viva & Deployment', status: 'Pending', date: '2026-07-15' }
      ]
    }
  ];

  const notifications = [
    { text: 'Guide Dr. A. M. Abirami approved Milestone 2 for Team Alpha.', time: '2 hours ago', unread: true },
    { text: 'New doubt raised by Chandran regarding Firebase ESP32 connection.', time: '4 hours ago', unread: true },
    { text: 'HOD Dr. S. Padmavathi scheduled a department-wide review for upcoming milestones.', time: '1 day ago', unread: false }
  ];

  return { teams, notifications };
}

// Initializing state from localStorage
function initStore() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      appState.teams = parsed.teams;
      appState.notifications = parsed.notifications;
    } catch (e) {
      console.error("Failed to parse storage, loading mock", e);
      const defaults = getInitialMockData();
      appState.teams = defaults.teams;
      appState.notifications = defaults.notifications;
    }
  } else {
    const defaults = getInitialMockData();
    appState.teams = defaults.teams;
    appState.notifications = defaults.notifications;
    saveStore();
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    teams: appState.teams,
    notifications: appState.notifications
  }));
}

// Helper to push notifications
function pushNotification(text) {
  appState.notifications.unshift({
    text: text,
    time: 'Just now',
    unread: true
  });
  saveStore();
  renderNotifications();
}

// ==========================================================================
// RENDER NOTIFICATIONS
// ==========================================================================
function renderNotifications() {
  const listEl = document.getElementById('notif-list');
  const badgeEl = document.getElementById('notif-badge');
  if (!listEl) return;

  const unreadCount = appState.notifications.filter(n => n.unread).length;
  badgeEl.textContent = unreadCount;
  badgeEl.style.display = unreadCount > 0 ? 'block' : 'none';

  listEl.innerHTML = '';
  if (appState.notifications.length === 0) {
    listEl.innerHTML = '<div class="notif-item">No notifications.</div>';
    return;
  }

  appState.notifications.forEach((notif, index) => {
    const item = document.createElement('div');
    item.className = `notif-item ${notif.unread ? 'unread' : ''}`;
    item.innerHTML = `
      <div>${notif.text}</div>
      <span class="notif-item-time">${notif.time}</span>
    `;
    item.addEventListener('click', () => {
      appState.notifications[index].unread = false;
      saveStore();
      renderNotifications();
    });
    listEl.appendChild(item);
  });
}

// ==========================================================================
// PORTAL ROUTING / SWITCHER
// ==========================================================================
function bindRoleSwitcher() {
  const buttons = document.querySelectorAll('.role-nav button');
  const views = document.querySelectorAll('.view-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = btn.getAttribute('data-role');
      
      // Update buttons visual
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Swap views with animations
      views.forEach(v => {
        v.classList.remove('active');
      });
      
      const targetView = document.getElementById(`${targetRole}-view`);
      setTimeout(() => {
        targetView.classList.add('active');
      }, 50);

      appState.activeRole = targetRole;
      updateUserProfileCard(targetRole);
      
      // Render dashboard contents of respective roles
      triggerDashboardRender(targetRole);
    });
  });
}

function updateUserProfileCard(role) {
  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const roleText = document.getElementById('user-role');

  if (role === 'student') {
    avatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=AlphaLeader';
    name.textContent = 'Adhithya';
    roleText.textContent = 'Team Alpha (Leader)';
  } else if (role === 'guide') {
    avatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=GuideAmit';
    name.textContent = 'Dr. A. M. Abirami';
    roleText.textContent = 'Senior Professor / Guide';
  } else if (role === 'hod') {
    avatar.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=HODSarah';
    name.textContent = 'Dr. S. Padmavathi';
    roleText.textContent = 'HOD (Artificial Intelligence)';
  }
}

function triggerDashboardRender(role) {
  if (role === 'student') {
    renderStudentView();
  } else if (role === 'guide') {
    renderGuideView();
  } else if (role === 'hod') {
    renderHodView();
  }
}

// ==========================================================================
// STUDENT VIEW LOGIC
// ==========================================================================
function renderStudentView() {
  const teamAlpha = appState.teams.find(t => t.id === 'team-a');
  if (!teamAlpha) return;

  // 1. Render Progress circular ring
  const circle = document.getElementById('student-ring');
  const progressText = document.getElementById('student-progress-val');
  const progressSlider = document.getElementById('completion-slider');
  
  if (circle) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference;
    const offset = circumference - (teamAlpha.progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    progressText.textContent = `${teamAlpha.progress}%`;
    progressSlider.value = teamAlpha.progress;
  }

  // 2. Render simple numeric metrics
  document.getElementById('student-logs-count').textContent = teamAlpha.logs.length;
  
  const approvalBadge = document.getElementById('student-approval-badge');
  approvalBadge.textContent = teamAlpha.approvalStatus;
  approvalBadge.className = 'status-badge';
  if (teamAlpha.approvalStatus === 'Approved') approvalBadge.classList.add('approved');
  else if (teamAlpha.approvalStatus === 'Pending Review') approvalBadge.classList.add('pending');
  else approvalBadge.classList.add('rejected');

  const openDoubts = teamAlpha.doubts.filter(d => d.status === 'open').length;
  const resolvedDoubts = teamAlpha.doubts.filter(d => d.status === 'resolved').length;
  document.getElementById('student-doubts-count').textContent = openDoubts;
  document.getElementById('student-doubts-resolved').textContent = `${resolvedDoubts} Resolved`;

  // 3. Render Daily work logs list
  const logsList = document.getElementById('student-logs-list');
  logsList.innerHTML = '';
  if (teamAlpha.logs.length === 0) {
    logsList.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">No daily logs entered yet.</div>';
  } else {
    // Sort logs descending by date
    const sortedLogs = [...teamAlpha.logs].sort((a,b) => new Date(b.date) - new Date(a.date));
    sortedLogs.forEach(log => {
      const initials = log.member.split(' ').map(n => n[0]).join('');
      const div = document.createElement('div');
      div.className = 'log-item';
      div.innerHTML = `
        <div class="log-avatar">${initials}</div>
        <div class="log-details">
          <div class="log-title-row">
            <strong>${log.member}</strong>
            <span>${log.date}</span>
          </div>
          <p class="log-item-desc">${log.desc}</p>
          <span class="log-meta-tag">${log.hours} Hours Logged</span>
        </div>
      `;
      logsList.appendChild(div);
    });
  }

  // 4. Render Files Uploaded list
  const filesList = document.getElementById('student-file-list');
  filesList.innerHTML = '';
  if (teamAlpha.files.length === 0) {
    filesList.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">No documents uploaded yet.</div>';
  } else {
    teamAlpha.files.forEach(file => {
      const fileBadge = file.status === 'Approved' ? 'badge-emerald' : (file.status === 'Pending' ? 'badge-orange' : 'badge-red');
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `
        <div class="file-info-col">
          <svg class="icon"><use href="#icon-file"/></svg>
          <div class="file-details">
            <strong>${file.name}</strong>
            <span>${file.size} &bull; Uploaded by ${file.uploadedBy} &bull; ${file.timestamp}</span>
          </div>
        </div>
        <div class="file-actions">
          <span class="badge ${fileBadge}">${file.status}</span>
        </div>
      `;
      filesList.appendChild(div);
    });
  }

  // 5. Render Milestone Timeline
  const timeline = document.getElementById('student-timeline');
  timeline.innerHTML = '';
  teamAlpha.milestones.forEach((m, index) => {
    // Determine milestone state
    let stateClass = '';
    if (m.status === 'Approved') {
      stateClass = 'completed';
    } else {
      // First unapproved milestone gets active status
      const prevAllApproved = teamAlpha.milestones.slice(0, index).every(prev => prev.status === 'Approved');
      if (prevAllApproved) {
        stateClass = 'active';
      }
    }

    const step = document.createElement('div');
    step.className = `timeline-step ${stateClass}`;
    step.innerHTML = `
      <div class="timeline-dot"></div>
      <h4>Milestone ${index+1}: ${m.title}</h4>
      <span>Target: ${m.date} &bull; Status: <strong>${m.status}</strong></span>
    `;
    timeline.appendChild(step);
  });

  // 6. Render Doubts List
  const doubtsList = document.getElementById('student-doubt-list');
  doubtsList.innerHTML = '';
  if (teamAlpha.doubts.length === 0) {
    doubtsList.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">No doubts posted.</div>';
  } else {
    teamAlpha.doubts.forEach(d => {
      const div = document.createElement('div');
      div.className = `doubt-card ${d.status === 'resolved' ? 'resolved' : 'open'}`;
      div.innerHTML = `
        <div class="doubt-card-header">
          <h5>${d.title}</h5>
          <span class="badge ${d.status === 'resolved' ? 'badge-emerald' : 'badge-orange'}">${d.status}</span>
        </div>
        ${d.reply ? `<div class="doubt-reply"><strong>Guide Reply:</strong> ${d.reply} <span style="font-size:0.65rem;opacity:0.7;">(Resolved by ${d.resolvedBy})</span></div>` : '<div class="doubt-reply" style="color:var(--text-muted);">Waiting for Guide response...</div>'}
      `;
      doubtsList.appendChild(div);
    });
  }

  // 7. Render Meetings MoM
  const meetingsList = document.getElementById('student-meeting-list');
  meetingsList.innerHTML = '';
  if (teamAlpha.meetings.length === 0) {
    meetingsList.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);">No meetings registered.</div>';
  } else {
    // Reverse meetings to show latest first
    [...teamAlpha.meetings].reverse().forEach(m => {
      const div = document.createElement('div');
      div.className = 'meeting-card';
      div.innerHTML = `
        <div class="meet-head">
          <span>${m.agenda}</span>
          <span>${m.date}</span>
        </div>
        <div class="meet-time-loc">
          <svg class="icon-inline"><use href="#icon-calendar"/></svg> Time: ${m.time || 'N/A'}
        </div>
        ${m.minutes ? `<div class="meet-mom-summary"><strong>MoM Highlights:</strong><br>${m.minutes.replace(/\n/g, '<br>')}</div>` : ''}
      `;
      meetingsList.appendChild(div);
    });
  }

  // 8. Render Guide Comments feed
  const commentsList = document.getElementById('student-comments-list');
  commentsList.innerHTML = '';
  
  // Collect all guide comments (either directly on feedback feed or notifications/logs)
  // Let's create comments feed specifically in state
  const feedbacks = teamAlpha.guideComments || [
    { author: 'Dr. A. M. Abirami', time: '1 day ago', text: 'Good progress on ESP32 setup. Focus on finalizing the DB schema quickly.' },
    { author: 'Dr. A. M. Abirami', time: '3 days ago', text: 'Submit your SRS document immediately so we can schedule the mid-term prototype review.' }
  ];

  feedbacks.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment-bubble guide-origin';
    div.innerHTML = `
      <div class="comment-meta">
        <span class="author">${c.author}</span>
        <span class="time">${c.time}</span>
      </div>
      <div class="comment-body">${c.text}</div>
    `;
    commentsList.appendChild(div);
  });
}

function bindStudentEvents() {
  const teamAlpha = appState.teams.find(t => t.id === 'team-a');
  if (!teamAlpha) return;

  // 1. Completion slider input handler
  const slider = document.getElementById('completion-slider');
  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    teamAlpha.progress = val;
    saveStore();
    
    // Quick circular progress update
    const circle = document.getElementById('student-ring');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (val / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById('student-progress-val').textContent = `${val}%`;
  });

  slider.addEventListener('change', () => {
    saveStore();
    // Notify HOD updates
    pushNotification(`Team Alpha updated project completion to ${teamAlpha.progress}%`);
  });

  // 2. Request approval button
  const reqBtn = document.getElementById('request-approval-btn');
  reqBtn.addEventListener('click', () => {
    teamAlpha.approvalStatus = 'Pending Review';
    saveStore();
    renderStudentView();
    pushNotification('Team Alpha requested milestone approval from Dr. A. M. Abirami.');
  });

  // 3. Log Form submit
  const logForm = document.getElementById('log-form');
  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const member = document.getElementById('log-member').value;
    const hours = parseFloat(document.getElementById('log-hours').value);
    const desc = document.getElementById('log-desc').value;
    const today = new Date().toISOString().split('T')[0];

    teamAlpha.logs.push({
      date: today,
      member: member,
      hours: hours,
      desc: desc
    });

    saveStore();
    renderStudentView();
    logForm.reset();
    pushNotification(`${member} (Team Alpha) logged ${hours} hours: "${desc.substring(0, 30)}..."`);
  });

  // 4. Doubt Form submit
  const doubtForm = document.getElementById('doubt-form');
  doubtForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('doubt-title').value;

    const newId = teamAlpha.doubts.length > 0 ? Math.max(...teamAlpha.doubts.map(d => d.id)) + 1 : 1;
    teamAlpha.doubts.push({
      id: newId,
      title: title,
      status: 'open',
      raisedBy: 'Adhithya',
      reply: '',
      resolvedBy: ''
    });

    saveStore();
    renderStudentView();
    doubtForm.reset();
    pushNotification(`Team Alpha raised a new technical doubt: "${title}"`);
  });

  // 5. File Drag & Drop Simulation
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');

  dropzone.addEventListener('click', () => fileInput.click());
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--neon-green)';
    dropzone.style.background = 'rgba(5, 255, 176, 0.04)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    dropzone.style.background = 'rgba(255, 255, 255, 0.01)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    dropzone.style.background = 'rgba(255, 255, 255, 0.01)';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateFileUpload(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      simulateFileUpload(e.target.files[0]);
    }
  });

  function simulateFileUpload(file) {
    const progressBox = document.getElementById('upload-progress-box');
    const filenameEl = document.getElementById('upload-filename');
    const percentEl = document.getElementById('upload-percent');
    const fillEl = document.getElementById('upload-progress-fill');

    progressBox.style.display = 'block';
    filenameEl.textContent = file.name;
    percentEl.textContent = '0%';
    fillEl.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      percentEl.textContent = `${progress}%`;
      fillEl.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressBox.style.display = 'none';

          // Add file to list
          const fileSizeStr = file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${(file.size / 1024).toFixed(0)} KB`;

          const now = new Date();
          const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

          teamAlpha.files.push({
            name: file.name,
            size: fileSizeStr,
            type: file.name.split('.').pop().toUpperCase(),
            status: 'Pending',
            uploadedBy: 'Adhithya',
            timestamp: timeStr
          });

          saveStore();
          renderStudentView();
          pushNotification(`Adhithya uploaded a new file: ${file.name}`);
        }, 300);
      }
    }, 150);
  }

  // 6. Modal controls for MoM
  const openModalBtn = document.getElementById('open-mom-modal');
  const closeModalBtn = document.getElementById('close-mom-modal');
  const cancelModalBtn = document.getElementById('btn-cancel-mom');
  const modal = document.getElementById('mom-modal');
  const momForm = document.getElementById('mom-form');

  openModalBtn.addEventListener('click', () => {
    modal.classList.add('show');
    // Pre-populate date with today
    document.getElementById('mom-date').value = new Date().toISOString().split('T')[0];
  });

  const hideModal = () => modal.classList.remove('show');
  closeModalBtn.addEventListener('click', hideModal);
  cancelModalBtn.addEventListener('click', hideModal);

  momForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('mom-title').value;
    const date = document.getElementById('mom-date').value;
    const attendees = document.getElementById('mom-attendees').value;
    const minutes = document.getElementById('mom-minutes').value;

    teamAlpha.meetings.push({
      date: date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agenda: title,
      minutes: `Attendees: ${attendees}\n\n${minutes}`
    });

    saveStore();
    renderStudentView();
    momForm.reset();
    hideModal();
    pushNotification(`Team Alpha published minutes for meeting: "${title}"`);
  });
}

// ==========================================================================
// GUIDE VIEW LOGIC
// ==========================================================================
function renderGuideView() {
  const guideTeams = appState.teams; // Guide can oversee all teams in our system
  const teamListEl = document.getElementById('guide-teams-list');
  if (!teamListEl) return;

  // Render guide team count
  document.getElementById('guide-team-count').textContent = `${guideTeams.length} Active`;

  // 1. Render sidebar list of teams
  teamListEl.innerHTML = '';
  guideTeams.forEach((team, index) => {
    const isSelected = index === appState.selectedGuideTeamIndex;
    const alertCount = team.doubts.filter(d => d.status === 'open').length + team.files.filter(f => f.status === 'Pending').length;
    
    const div = document.createElement('div');
    div.className = `guide-team-btn ${isSelected ? 'active' : ''}`;
    div.innerHTML = `
      <div class="btn-header">
        <span>${team.name}</span>
        ${alertCount > 0 ? `<span class="badge badge-orange">${alertCount} alert${alertCount>1?'s':''}</span>` : ''}
      </div>
      <span class="team-subtext">${team.project.substring(0, 32)}...</span>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${team.progress}%"></div>
      </div>
    `;
    div.addEventListener('click', () => {
      appState.selectedGuideTeamIndex = index;
      // Close comparison overlay if open
      document.getElementById('teams-comparison-section').classList.add('hidden');
      document.getElementById('single-team-detail-pane').classList.remove('hidden');
      renderGuideView();
    });
    teamListEl.appendChild(div);
  });

  // Selected Team Details
  const selectedTeam = guideTeams[appState.selectedGuideTeamIndex];
  if (!selectedTeam) return;

  // Update banner information
  document.getElementById('guide-selected-team-name').textContent = selectedTeam.name;
  document.getElementById('guide-selected-team-project').textContent = selectedTeam.project;
  document.getElementById('guide-selected-team-prog-text').textContent = `${selectedTeam.progress}%`;
  
  const pendingFilesCount = selectedTeam.files.filter(f => f.status === 'Pending').length;
  document.getElementById('guide-selected-team-files-text').textContent = pendingFilesCount;
  
  const approvedMilestones = selectedTeam.milestones.filter(m => m.status === 'Approved').length;
  document.getElementById('guide-selected-team-milestone-text').textContent = `${approvedMilestones}/${selectedTeam.milestones.length}`;

  // 2. Render Selected Team Logs
  const logFeed = document.getElementById('guide-team-logs');
  logFeed.innerHTML = '';
  if (selectedTeam.logs.length === 0) {
    logFeed.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:10px;">No updates logged.</div>';
  } else {
    // Sort log by date descending
    const sortedLogs = [...selectedTeam.logs].sort((a,b) => new Date(b.date) - new Date(a.date));
    sortedLogs.forEach(log => {
      const initials = log.member.split(' ').map(n => n[0]).join('');
      const div = document.createElement('div');
      div.className = 'log-item';
      div.innerHTML = `
        <div class="log-avatar">${initials}</div>
        <div class="log-details">
          <div class="log-title-row">
            <strong>${log.member}</strong>
            <span>${log.date}</span>
          </div>
          <p class="log-item-desc">${log.desc}</p>
          <span class="log-meta-tag">${log.hours} Hours Logged</span>
        </div>
      `;
      logFeed.appendChild(div);
    });
  }

  // 3. Render Selected Team Submissions Review list
  const docFeed = document.getElementById('guide-team-documents');
  docFeed.innerHTML = '';
  if (selectedTeam.files.length === 0) {
    docFeed.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:10px;">No documents submitted.</div>';
  } else {
    selectedTeam.files.forEach((file, fileIdx) => {
      const isPending = file.status === 'Pending';
      const div = document.createElement('div');
      div.className = 'doc-review-card';
      div.innerHTML = `
        <div class="doc-review-info">
          <svg class="icon"><use href="#icon-file"/></svg>
          <div class="doc-review-details">
            <strong>${file.name}</strong>
            <span>Size: ${file.size} &bull; Uploaded by ${file.uploadedBy} &bull; ${file.timestamp}</span>
          </div>
        </div>
        <div class="doc-review-actions">
          ${isPending 
            ? `<button class="btn btn-sm btn-blue btn-approve-doc" data-idx="${fileIdx}">Approve</button>
               <button class="btn btn-sm btn-dark btn-reject-doc" data-idx="${fileIdx}">Reject</button>` 
            : `<span class="badge ${file.status === 'Approved' ? 'badge-emerald' : 'badge-red'}">${file.status}</span>`
          }
        </div>
      `;
      docFeed.appendChild(div);
    });

    // Attach actions
    docFeed.querySelectorAll('.btn-approve-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        selectedTeam.files[idx].status = 'Approved';
        saveStore();
        renderGuideView();
        pushNotification(`Dr. A. M. Abirami approved document: ${selectedTeam.files[idx].name}`);
      });
    });
    docFeed.querySelectorAll('.btn-reject-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        selectedTeam.files[idx].status = 'Rejected';
        saveStore();
        renderGuideView();
        pushNotification(`Dr. A. M. Abirami rejected document: ${selectedTeam.files[idx].name}`);
      });
    });
  }

  // 4. Render Team doubts to resolve
  const doubtFeed = document.getElementById('guide-team-doubts');
  doubtFeed.innerHTML = '';
  const teamDoubts = selectedTeam.doubts;
  if (teamDoubts.length === 0) {
    doubtFeed.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:10px;">No doubts raised by this team.</div>';
  } else {
    teamDoubts.forEach((d, dIdx) => {
      const isResolved = d.status === 'resolved';
      const div = document.createElement('div');
      div.className = `doubt-card ${isResolved ? 'resolved' : 'open'}`;
      div.style.marginBottom = '10px';
      div.innerHTML = `
        <div class="doubt-card-header">
          <h5>${d.title}</h5>
          <span class="badge ${isResolved ? 'badge-emerald' : 'badge-orange'}">${d.status}</span>
        </div>
        <p style="font-size:0.75rem;color:var(--text-muted);margin:4px 0 8px 0;">Raised by ${d.raisedBy}</p>
        ${isResolved 
          ? `<div class="doubt-reply"><strong>Resolution reply:</strong> ${d.reply}</div>` 
          : `<form class="quick-form doubt-resolve-form" data-idx="${dIdx}">
               <input type="text" placeholder="Type clarification / answer..." required class="resolve-input">
               <button type="submit" class="btn btn-sm btn-orange">Resolve Doubt</button>
             </form>`
        }
      `;
      doubtFeed.appendChild(div);
    });

    // Attach resolution handlers
    doubtFeed.querySelectorAll('.doubt-resolve-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idx = parseInt(form.getAttribute('data-idx'));
        const replyText = form.querySelector('.resolve-input').value;
        
        selectedTeam.doubts[idx].status = 'resolved';
        selectedTeam.doubts[idx].reply = replyText;
        selectedTeam.doubts[idx].resolvedBy = 'Dr. A. M. Abirami';

        saveStore();
        renderGuideView();
        pushNotification(`Dr. A. M. Abirami resolved doubt: "${selectedTeam.doubts[idx].title}"`);
      });
    });
  }

  // 5. Render Milestone controls
  const milestoneFeed = document.getElementById('guide-team-milestones');
  milestoneFeed.innerHTML = '';
  selectedTeam.milestones.forEach((m, mIdx) => {
    const isApproved = m.status === 'Approved';
    const isPending = m.status === 'Pending';
    const div = document.createElement('div');
    div.className = 'milestone-control-item';
    div.innerHTML = `
      <div class="milestone-label-col">
        <strong>${m.title}</strong>
        <span>Target Date: ${m.date}</span>
      </div>
      <div class="milestone-buttons">
        ${isApproved 
          ? `<span class="badge badge-emerald">Approved</span>`
          : (isPending 
            ? `<button class="btn btn-sm btn-blue btn-app-milestone" data-idx="${mIdx}">Approve</button>
               <button class="btn btn-sm btn-dark btn-rej-milestone" data-idx="${mIdx}">Reject</button>`
            : `<button class="btn btn-sm btn-indigo btn-app-milestone" data-idx="${mIdx}">Approve Force</button>`
          )
        }
      </div>
    `;
    milestoneFeed.appendChild(div);
  });

  // Attach milestone controls click listeners
  milestoneFeed.querySelectorAll('.btn-app-milestone').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      selectedTeam.milestones[idx].status = 'Approved';
      // Calculate progress impact
      const approvedCount = selectedTeam.milestones.filter(m => m.status === 'Approved').length;
      selectedTeam.progress = Math.round((approvedCount / selectedTeam.milestones.length) * 100);
      
      // Update global project approval
      if (approvedCount === selectedTeam.milestones.length) {
        selectedTeam.approvalStatus = 'Approved';
      }

      saveStore();
      renderGuideView();
      pushNotification(`Dr. A. M. Abirami approved milestone "${selectedTeam.milestones[idx].title}" for ${selectedTeam.name}.`);
    });
  });

  milestoneFeed.querySelectorAll('.btn-rej-milestone').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      selectedTeam.milestones[idx].status = 'Rejected';
      selectedTeam.approvalStatus = 'Changes Requested';
      saveStore();
      renderGuideView();
      pushNotification(`Dr. A. M. Abirami rejected milestone "${selectedTeam.milestones[idx].title}" for ${selectedTeam.name}.`);
    });
  });

  // 6. Render Scheduled Meetings list
  const meetingsList = document.getElementById('guide-scheduled-meetings');
  meetingsList.innerHTML = '';
  if (selectedTeam.meetings.length === 0) {
    meetingsList.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:10px;">No scheduled meetings.</div>';
  } else {
    selectedTeam.meetings.forEach(m => {
      const div = document.createElement('div');
      div.className = 'meeting-card';
      div.style.marginBottom = '5px';
      div.innerHTML = `
        <div class="meet-head">
          <span>${m.agenda}</span>
          <span>${m.date}</span>
        </div>
        <div class="meet-time-loc">Time: ${m.time}</div>
      `;
      meetingsList.appendChild(div);
    });
  }

  // 7. Render Feedback Feed Comments
  const feedbackFeed = document.getElementById('guide-posted-comments');
  feedbackFeed.innerHTML = '';
  const comments = selectedTeam.guideComments || [
    { author: 'Dr. A. M. Abirami', time: '1 day ago', text: 'Good progress on ESP32 setup. Focus on finalizing the DB schema quickly.' },
    { author: 'Dr. A. M. Abirami', time: '3 days ago', text: 'Submit your SRS document immediately so we can schedule the mid-term prototype review.' }
  ];

  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment-bubble guide-origin';
    div.style.width = '100%';
    div.innerHTML = `
      <div class="comment-meta">
        <span class="author">${c.author}</span>
        <span class="time">${c.time}</span>
      </div>
      <div class="comment-body">${c.text}</div>
    `;
    feedbackFeed.appendChild(div);
  });
}

function bindGuideEvents() {
  // 1. Single Team Feedback submission
  const feedbackForm = document.getElementById('guide-comment-form');
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const txt = document.getElementById('guide-comment-input').value;
    const selectedTeam = appState.teams[appState.selectedGuideTeamIndex];
    if (!selectedTeam) return;

    if (!selectedTeam.guideComments) {
      selectedTeam.guideComments = [
        { author: 'Dr. A. M. Abirami', time: '1 day ago', text: 'Good progress on ESP32 setup. Focus on finalizing the DB schema quickly.' },
        { author: 'Dr. A. M. Abirami', time: '3 days ago', text: 'Submit your SRS document immediately so we can schedule the mid-term prototype review.' }
      ];
    }

    selectedTeam.guideComments.unshift({
      author: 'Dr. A. M. Abirami',
      time: 'Just now',
      text: txt
    });

    saveStore();
    renderGuideView();
    feedbackForm.reset();
    pushNotification(`Dr. A. M. Abirami left feedback for ${selectedTeam.name}: "${txt.substring(0, 30)}..."`);
  });

  // 2. Schedule Review meeting Form submission
  const scheduleForm = document.getElementById('guide-schedule-form');
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('meet-date').value;
    const time = document.getElementById('meet-time').value;
    const agenda = document.getElementById('meet-agenda').value;

    const selectedTeam = appState.teams[appState.selectedGuideTeamIndex];
    if (!selectedTeam) return;

    selectedTeam.meetings.push({
      date: date,
      time: time,
      agenda: agenda,
      minutes: ''
    });

    saveStore();
    renderGuideView();
    scheduleForm.reset();
    pushNotification(`Dr. A. M. Abirami scheduled review meeting with ${selectedTeam.name} on ${date} at ${time}.`);
  });

  // 3. Comparison Dashboard Toggles
  const btnCompare = document.getElementById('btn-compare-teams');
  const btnCloseCompare = document.getElementById('btn-close-comparison');
  
  btnCompare.addEventListener('click', () => {
    document.getElementById('single-team-detail-pane').classList.add('hidden');
    
    // Populate Comparison Table
    const tbody = document.getElementById('comparison-table-body');
    tbody.innerHTML = '';

    appState.teams.forEach(team => {
      const openDoubts = team.doubts.filter(d => d.status === 'open').length;
      const lastFile = team.files.length > 0 ? team.files[team.files.length - 1] : null;
      const lastFileStr = lastFile ? `${lastFile.name} (${lastFile.status})` : 'None';
      const approvedCount = team.milestones.filter(m => m.status === 'Approved').length;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${team.name}</strong></td>
        <td>${team.project}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="bar-container" style="flex:1; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; width:80px;">
              <div style="width:${team.progress}%; background:var(--neon-blue); height:100%;"></div>
            </div>
            <span>${team.progress}%</span>
          </div>
        </td>
        <td>${team.logs.length}</td>
        <td><span class="badge ${openDoubts > 0 ? 'badge-orange' : 'badge-emerald'}">${openDoubts} open</span></td>
        <td>${lastFileStr}</td>
        <td>${approvedCount} / ${team.milestones.length}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('teams-comparison-section').classList.remove('hidden');
  });

  btnCloseCompare.addEventListener('click', () => {
    document.getElementById('teams-comparison-section').classList.add('hidden');
    document.getElementById('single-team-detail-pane').classList.remove('hidden');
  });
}

// ==========================================================================
// HOD / COORDINATOR VIEW LOGIC
// ==========================================================================
function renderHodView() {
  const teams = appState.teams;
  
  // 1. Calculate general numbers
  document.getElementById('hod-active-teams').textContent = teams.length;

  // Delayed Teams: progress < 50% AND have outstanding unapproved early milestones (e.g. M1 or M2 pending/rejected)
  const delayedTeams = teams.filter(t => {
    // If progress is less than 50%, or guide explicitly rejected a milestone
    const hasRejected = t.milestones.some(m => m.status === 'Rejected');
    return t.progress < 50 || hasRejected;
  });
  document.getElementById('hod-delayed-teams').textContent = delayedTeams.length;

  const totalProgressSum = teams.reduce((acc, curr) => acc + curr.progress, 0);
  const avgProg = (totalProgressSum / teams.length).toFixed(1);
  document.getElementById('hod-avg-progress').textContent = `${avgProg}%`;

  // Upcoming reviews (total meetings across department)
  const totalMeetings = teams.reduce((acc, curr) => acc + curr.meetings.length, 0);
  document.getElementById('hod-upcoming-reviews').textContent = totalMeetings;

  // 2. Department average calculation and Chart rendering
  const departments = [
    { name: 'AI & DS', class: 'cse' },
    { name: 'CSE (AIML)', class: 'it' },
    { name: 'M.Tech AI', class: 'ece' }
  ];
  departments.forEach(dept => {
    const deptTeams = teams.filter(t => t.department === dept.name);
    const avg = deptTeams.length > 0 
      ? Math.round(deptTeams.reduce((sum, t) => sum + t.progress, 0) / deptTeams.length) 
      : 0;

    const bar = document.querySelector(`.fill-${dept.class}`);
    const valText = bar.parentElement.nextElementSibling;
    if (bar && valText) {
      bar.style.width = `${avg}%`;
      valText.textContent = `${avg}%`;
    }
  });

  // 3. Render guide wise performance summary
  const guideTbody = document.getElementById('hod-guides-tbody');
  guideTbody.innerHTML = '';
  // Group by unique guides
  const guidesMap = {};
  teams.forEach(t => {
    if (!guidesMap[t.guide]) {
      guidesMap[t.guide] = { name: t.guide, count: 0, sumProgress: 0, approvedMilestones: 0, totalMilestones: 0 };
    }
    guidesMap[t.guide].count++;
    guidesMap[t.guide].sumProgress += t.progress;
    guidesMap[t.guide].approvedMilestones += t.milestones.filter(m => m.status === 'Approved').length;
    guidesMap[t.guide].totalMilestones += t.milestones.length;
  });

  Object.values(guidesMap).forEach(g => {
    const avgProgress = Math.round(g.sumProgress / g.count);
    const milestoneRatio = `${g.approvedMilestones} / ${g.totalMilestones}`;
    
    // Status color
    let statusClass = 'badge-emerald';
    let statusTxt = 'On Track';
    if (avgProgress < 50) {
      statusClass = 'badge-red';
      statusTxt = 'Needs Review';
    } else if (avgProgress < 70) {
      statusClass = 'badge-orange';
      statusTxt = 'Moderate';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${g.name}</strong></td>
      <td>${g.count} Teams</td>
      <td>${avgProgress}%</td>
      <td>${milestoneRatio} Approved</td>
      <td><span class="badge ${statusClass}">${statusTxt}</span></td>
    `;
    guideTbody.appendChild(tr);
  });

  // 4. Render Delayed Teams Alert panels
  const delayedList = document.getElementById('hod-delayed-teams-list');
  delayedList.innerHTML = '';
  if (delayedTeams.length === 0) {
    delayedList.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:10px;">All teams are on track!</div>';
  } else {
    delayedTeams.forEach(t => {
      const openDoubts = t.doubts.filter(d => d.status === 'open').length;
      const lastUpdate = t.logs.length > 0 ? t.logs[t.logs.length - 1].date : 'No logs';

      const div = document.createElement('div');
      div.className = 'delayed-team-card';
      div.innerHTML = `
        <div class="delayed-info">
          <h5>${t.name} &bull; <span style="color:var(--neon-orange);">${t.progress}% Progress</span></h5>
          <p>${t.project}</p>
          <p style="font-size:0.7rem;opacity:0.8;margin-top:4px;">Supervisor: ${t.guide} | Open doubts: ${openDoubts} | Last update: ${lastUpdate}</p>
        </div>
        <button class="btn btn-sm btn-dark btn-ping-guide" data-team="${t.name}" data-guide="${t.guide}">Notify Guide</button>
      `;
      delayedList.appendChild(div);
    });

    delayedList.querySelectorAll('.btn-ping-guide').forEach(btn => {
      btn.addEventListener('click', () => {
        const teamName = btn.getAttribute('data-team');
        const guideName = btn.getAttribute('data-guide');
        alert(`Notification dispatched to ${guideName}: "Please review ${teamName}'s delayed progress immediately."`);
        pushNotification(`HOD dispatched progress warning alert to ${guideName} for ${teamName}.`);
      });
    });
  }

  // 5. Department activity feed (Latest logs from ALL teams)
  const allLogs = [];
  teams.forEach(team => {
    team.logs.forEach(log => {
      allLogs.push({
        teamName: team.name,
        date: log.date,
        member: log.member,
        hours: log.hours,
        desc: log.desc
      });
    });
  });

  // Sort chronological descending
  allLogs.sort((a,b) => new Date(b.date) - new Date(a.date));

  const deptFeed = document.getElementById('hod-activity-feed');
  deptFeed.innerHTML = '';
  if (allLogs.length === 0) {
    deptFeed.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:10px;">No departmental activity logged.</div>';
  } else {
    // Show top 8 latest logs
    allLogs.slice(0, 8).forEach(log => {
      const initials = log.member.split(' ').map(n => n[0]).join('');
      const div = document.createElement('div');
      div.className = 'log-item';
      div.innerHTML = `
        <div class="log-avatar">${initials}</div>
        <div class="log-details">
          <div class="log-title-row">
            <strong>${log.member} (${log.teamName})</strong>
            <span>${log.date}</span>
          </div>
          <p class="log-item-desc">${log.desc}</p>
          <span class="log-meta-tag">${log.hours} Hours Logged</span>
        </div>
      `;
      deptFeed.appendChild(div);
    });
  }
}

// ==========================================================================
// NOTIFICATION DROPDOWN TOGGLES
// ==========================================================================
function bindNotificationDropdown() {
  const btn = document.getElementById('notif-btn');
  const menu = document.getElementById('notif-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.remove('show');
    }
  });
}

// ==========================================================================
// APPLICATION INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Init Data Store
  initStore();

  // 2. Bind Notif UI & Renders
  renderNotifications();
  bindNotificationDropdown();

  // 3. Bind Role Swappings
  bindRoleSwitcher();

  // 4. Bind event listeners for actions
  bindStudentEvents();
  bindGuideEvents();

  // 5. Initial Render on Student dashboard
  triggerDashboardRender('student');
});
