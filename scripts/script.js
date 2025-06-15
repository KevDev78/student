const sections = document.querySelectorAll('.section');
const quotes = [
  "Believe you can and you're halfway there.",
  "The future depends on what you do today.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is not in what you have, but who you are.",
  "Push yourself, because no one else is going to do it for you."
];

function showSection(id) {
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Quote Changer
function changeQuote() {
  const quoteEl = document.getElementById('quote');
  quoteEl.classList.remove('fade-in');
  quoteEl.classList.add('fade-out');

  setTimeout(() => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = `"${newQuote}"`;
    quoteEl.classList.remove('fade-out');
    quoteEl.classList.add('fade-in');
  }, 500);
}

// Pomodoro Timer
let timer;
let timeLeft = 25 * 60;

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
      timeLeft = 25 * 60;
      updateTimerDisplay();
    } else {
      timeLeft--;
      updateTimerDisplay();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timerDisplay').textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Calendar with Event Tracking
let currentYear, currentMonth;
const events = {}; // { 'YYYY-MM-DD': ['Event 1', ...] }

function generateCalendar(year, month) {
  const calendarGrid = document.getElementById('calendarGrid');
  const monthYear = document.getElementById('monthYear');
  const eventsList = document.getElementById('eventsList');

  calendarGrid.innerHTML = `
    <div>Sun</div><div>Mon</div><div>Tue</div>
    <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
  `;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthYear.textContent = `${monthNames[month]} ${year}`;
  currentYear = year;
  currentMonth = month;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.classList.add('blank-day');
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = day;

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (events[dateKey] && events[dateKey].length > 0) {
      dayDiv.classList.add('has-event');
    }

    dayDiv.addEventListener('click', () => handleDayClick(year, month, day));
    calendarGrid.appendChild(dayDiv);
  }

  eventsList.innerHTML = "<em>Select a day to view/add events</em>";
}

function handleDayClick(year, month, day) {
  const eventsList = document.getElementById('eventsList');
  const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dayEvents = events[selectedDate] || [];

  let html = `<h4>Events for ${selectedDate}</h4>`;
  html += `<ul>${dayEvents.map(e => `<li>${e}</li>`).join("")}</ul>`;
  html += `
    <input type="text" id="newEventInput" placeholder="Add event..."/>
    <button onclick="addEvent('${selectedDate}')">Add</button>
  `;

  eventsList.innerHTML = html;
}

function addEvent(dateStr) {
  const input = document.getElementById('newEventInput');
  const val = input.value.trim();
  if (!val) return;

  if (!events[dateStr]) events[dateStr] = [];

  if (!events[dateStr].includes(val)) {
    events[dateStr].push(val);
  }

  input.value = "";
  handleDayClick(currentYear, currentMonth, Number(dateStr.split("-")[2]));
  generateCalendar(currentYear, currentMonth);
}

// Load Grades from JSON
function loadGrades() {
  fetch('data/grades.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch grades');
      return res.json();
    })
    .then(data => {
      const container = document.getElementById('subjectsContainer');
      container.innerHTML = '';
      data.forEach(({ subject, grade }) => {
        const li = document.createElement('li');
        li.textContent = `${subject}: ${grade}`;
        container.appendChild(li);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById('subjectsContainer').textContent = 'Failed to load grades.';
    });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
  loadGrades();

  const today = new Date();
  generateCalendar(today.getFullYear(), today.getMonth());

  document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
  });
});
