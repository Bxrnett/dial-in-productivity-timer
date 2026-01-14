addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productivity Timer</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🔥 Productivity Timer 🔥</h1>
        
        <div class="timer-section">
            <div class="timer-label">
                <span class="status-badge" id="statusBadge">Ready to Dial-In</span>
            </div>
            
            <!-- Coffee Cup Visualization -->
            <div class="coffee-container">
                <div class="coffee-cup">
                    <div class="coffee-liquid" id="coffeeLiquid"></div>
                    <div class="coffee-handle"></div>
                </div>
            </div>
            
            <div class="timer-display" id="timerDisplay">25:00</div>
            
            <div class="session-info">
                <div>Session: <strong id="sessionCount">1/4</strong></div>
                <div>Session completed: <strong id="pomodoroCount">0</strong></div>
            </div>

            <div class="current-task" id="currentTaskDisplay">
                No task selected
            </div>

            <div class="button-group">
                <button class="btn-primary" id="startBtn" onclick="startTimer()">Start</button>
                <button class="btn-secondary" id="pauseBtn" onclick="pauseTimer()" disabled>Pause</button>
                <button class="btn-danger" id="resetBtn" onclick="resetTimer()">Reset</button>
            </div>
        </div>

        <div class="task-section">
            <h2>📝 Task List</h2>
            
            <div class="task-input-group">
                <input 
                    type="text" 
                    id="taskInput" 
                    placeholder="Enter a new task..." 
                    onkeypress="handleTaskInputKeypress(event)"
                />
                <button class="btn-primary" onclick="addTask()">Add Task</button>
            </div>

            <ul class="task-list" id="taskList">
                <li class="empty-state">No tasks yet. Add one above!</li>
            </ul>
        </div>
    </div>

    <script>
        // Time settings
        let timeLeft = 25 * 60; // 25 minutes in seconds
        let timerInterval = null;
        let isRunning = false;
        let currentSession = 1;
        let totalPomodoros = 0;
        let timerMode = 'focus'; // 'focus', 'rest', 'break'

        // Task status
        let tasks = [];
        let selectedTaskId = null;

        // Timer functions
        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timerDisplay').textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            
            document.getElementById('sessionCount').textContent = currentSession + '/4';
            document.getElementById('pomodoroCount').textContent = totalPomodoros;
            
            updateCoffeeLiquid();
            updateStatusBadge();
        }
        
        function updateCoffeeLiquid() {
            const totalTime = timerMode === 'focus' ? 25 * 60 : (timerMode === 'rest' ? 5 * 60 : 15 * 60);
            const percentage = (timeLeft / totalTime) * 100;
            const coffeeLiquid = document.getElementById('coffeeLiquid');
            coffeeLiquid.style.height = percentage + '%';
        }

        function updateStatusBadge() {
            const badge = document.getElementById('statusBadge');
            if (!isRunning) {
                badge.textContent = 'Ready to Dial-In';
                badge.className = 'status-badge status-focus';
                return;
            }

            if (timerMode === 'focus') {
                badge.textContent = '🎯 Focus Time';
                badge.className = 'status-badge status-focus';
            } else if (timerMode === 'rest') {
                badge.textContent = '☕ Short Break';
                badge.className = 'status-badge status-rest';
            } else if (timerMode === 'break') {
                badge.textContent = '🌴 Long Break';
                badge.className = 'status-badge status-break';
            }
        }

        function startTimer() {
            if (!selectedTaskId) {
                alert('Please select a task before starting the timer!');
                return;
            }

            isRunning = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('pauseBtn').disabled = false;
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft <= 0) {
                    handleTimerComplete();
                }
            }, 1000);
        }

        function pauseTimer() {
            isRunning = false;
            clearInterval(timerInterval);
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
            updateStatusBadge();
        }

        function resetTimer() {
            pauseTimer();
            currentSession = 1;
            totalPomodoros = 0;
            timerMode = 'focus';
            timeLeft = 25 * 60;
            updateDisplay();
        }

        function handleTimerComplete() {
            pauseTimer();
            playNotificationSound();
            
            if (timerMode === 'focus') {
                totalPomodoros++;
                
                if (currentSession === 4) {
                    // Long break after 4 sessions
                    alert('🎉 You smashed that! Time for a 15-minute break!');
                    timerMode = 'break';
                    timeLeft = 15 * 60;
                    currentSession = 1;
                } else {
                    // Short break
                    alert('✅ You smashed that! Take a 5-minute break.');
                    timerMode = 'rest';
                    timeLeft = 5 * 60;
                    currentSession++;
                }
            } else {
                // Break is over, back to focus
                alert('Break time is over! Ready for the next Dial-In session?');
                timerMode = 'focus';
                timeLeft = 25 * 60;
            }
            
            updateDisplay();
        }

        function playNotificationSound() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }

        // Task functions
        function addTask() {
            const input = document.getElementById('taskInput');
            const taskText = input.value.trim();
            
            if (!taskText) {
                alert('Please enter a task!');
                return;
            }
            
            const task = {
                id: Date.now(),
                text: taskText
            };
            
            tasks.push(task);
            input.value = '';
            renderTasks();
        }

        function deleteTask(taskId) {
            tasks = tasks.filter(t => t.id !== taskId);
            if (selectedTaskId === taskId) {
                selectedTaskId = null;
                updateCurrentTaskDisplay();
            }
            renderTasks();
        }

        function selectTask(taskId) {
            selectedTaskId = taskId;
            renderTasks();
            updateCurrentTaskDisplay();
        }

        function updateCurrentTaskDisplay() {
            const display = document.getElementById('currentTaskDisplay');
            if (selectedTaskId) {
                const task = tasks.find(t => t.id === selectedTaskId);
                display.textContent = 'Working on: ' + task.text;
            } else {
                display.textContent = 'No task selected';
            }
        }

        function renderTasks() {
            const taskList = document.getElementById('taskList');
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
                return;
            }
            
            taskList.innerHTML = tasks.map(function(task) {
                return '<li class="task-item ' + (selectedTaskId === task.id ? 'selected' : '') + '">' +
                    '<input type="radio" name="task" ' + (selectedTaskId === task.id ? 'checked' : '') + ' onchange="selectTask(' + task.id + ')" />' +
                    '<span class="task-text" onclick="selectTask(' + task.id + ')">' + task.text + '</span>' +
                    '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Delete</button>' +
                '</li>';
            }).join('');
            
            updateCurrentTaskDisplay();
        }

        function handleTaskInputKeypress(event) {
            if (event.key === 'Enter') {
                addTask();
            }
        }

        // Initialize display
        updateDisplay();
    </script>
</body>
</html>`;

const STYLE_CSS = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #4f4f4f 0%, #18604d 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 40px;
    max-width: 600px;
    width: 100%;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 2em;
}

.timer-section {
    text-align: center;
    margin-bottom: 40px;
}

.timer-display {
    font-size: 2em;
    font-weight: bold;
    color: #18604d;
    margin: 20px 0;
    font-variant-numeric: tabular-nums;
}

.timer-label {
    font-size: 1.2em;
    color: #666;
    margin-bottom: 10px;
}

.session-info {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 20px 0;
    font-size: 0.9em;
    color: #666;
}

.current-task {
    background: #f0f0f0;
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    font-style: italic;
    color: #555;
}

.button-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

button {
    padding: 12px 24px;
    font-size: 1em;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-primary {
    background: #18604d;
    color: white;
}

.btn-primary:hover {
    background: #18604d;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: #95a5a6;
    color: white;
}

.btn-secondary:hover {
    background: #7f8c8d;
}

.btn-danger {
    background: #e74c3c;
    color: white;
}

.btn-danger:hover {
    background: #c0392b;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.task-section {
    margin-top: 40px;
    padding-top: 40px;
    border-top: 2px solid #eee;
}

.task-section h2 {
    color: #333;
    margin-bottom: 20px;
}

.task-input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input[type="text"] {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1em;
    transition: border-color 0.3s ease;
}

input[type="text"]:focus {
    outline: none;
    border-color: #18604d;
}

.task-list {
    list-style: none;
}

.task-item {
    background: #f8f9fa;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
}

.task-item:hover {
    background: #e9ecef;
}

.task-item.selected {
    background: #667eea;
    color: white;
}

.task-item input[type="radio"] {
    cursor: pointer;
}

.task-text {
    flex: 1;
    cursor: pointer;
}

.delete-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
}

.delete-btn:hover {
    background: #c0392b;
}

.empty-state {
    text-align: center;
    color: #999;
    padding: 40px;
    font-style: italic;
}

.status-badge {
    display: inline-block;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 600;
}

.status-focus {
    background: #18604d;
    color: white;
}

.status-rest {
    background: #27ae60;
    color: white;
}

.status-break {
    background: #f39c12;
    color: white;
}

/* Coffee Cup Styles */
.coffee-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0 20px 0;
}

.coffee-cup {
    position: relative;
    width: 120px;
    height: 140px;
    background: linear-gradient(to right, #fff 0%, #f5f5f5 100%);
    border: 4px solid #8B4513;
    border-radius: 0 0 10px 10px;
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1),
                0 5px 15px rgba(0,0,0,0.2);
}

.coffee-liquid {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #6F4E37 0%, #3E2723 100%);
    transition: height 1s ease-out;
    border-radius: 0 0 6px 6px;
}

.coffee-liquid::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 0;
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    animation: steam 3s ease-in-out infinite;
}

.coffee-handle {
    position: absolute;
    right: -40px;
    top: 30px;
    width: 45px;
    height: 70px;
    border: 5px solid #000000;
    border-left: none;
    border-radius: 0 50px 50px 0;
    background: transparent;
    box-shadow: inset -3px 0 5px rgba(0,0,0,0.2);
}

@keyframes steam {
    0%, 100% {
        opacity: 0.3;
        transform: translateY(0);
    }
    50% {
        opacity: 0.6;
        transform: translateY(-2px);
    }
}`;

async function handle(request) {
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/index.html' : url.pathname;

  if (path === '/index.html') {
    return new Response(INDEX_HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (path === '/style.css') {
    return new Response(STYLE_CSS, { headers: { 'content-type': 'text/css; charset=utf-8' } });
  }

  return new Response('Not found', { status: 404 });
}
