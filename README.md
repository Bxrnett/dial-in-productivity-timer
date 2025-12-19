# Dial-In Productivity Timer

A clean, modern Pomodoro timer web application with integrated task management to help you stay focused and productive.
https://dial-in-timer.wb1.uk/

## Features

- **Pomodoro Timer**
  - 25-minute focus sessions
  - 5-minute short breaks
  - 15-minute long break after completing 4 focus sessions
  - Visual status indicators for different timer modes
  - Audio notification when sessions complete

- **Task Management**
  - Add and delete tasks
  - Select the task you're working on before starting the timer
  - Visual indication of the currently selected task
  - Clean, intuitive interface

- **Progress Tracking**
  - Session counter (1-4)
  - Total completed pomodoros counter
  - Current task display during timer

## How to Use

1. **Add Tasks**: Enter tasks in the input field and click "Add Task" (or press Enter)
2. **Select a Task**: Click on a task or its radio button to select what you'll work on
3. **Start Timer**: Click the "Start" button to begin a 25-minute focus session
4. **Take Breaks**: When the timer completes, take the recommended break
5. **Complete Cycles**: After 4 focus sessions, enjoy a longer 15-minute break

## Installation

No installation required! Simply open `index.html` in any modern web browser.

```bash
# Clone or download this repository
# Then open the file
start index.html  # Windows
# or
open index.html   # macOS
# or
xdg-open index.html  # Linux
```

## File Structure

```
dial-in-productivity-timer/
├── index.html    # Main HTML structure and JavaScript logic
├── style.css     # All styling and visual design
└── README.md     # This file
```

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with modern features (Grid, Flexbox, Gradients)
- **Vanilla JavaScript**: Timer logic, task management, and interactivity
- **Web Audio API**: Notification sounds

## Browser Compatibility

Works on all modern browsers including:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Changelog

### Initial Release
- Implemented Pomodoro timer with 25/5/15 minute intervals
- Added task list with full CRUD operations
- Integrated task selection with timer functionality
- Created responsive, modern UI with gradient background
- Added session and pomodoro tracking
- Implemented audio notifications
- Separated CSS into external stylesheet for better maintainability

## Future Enhancements

Potential features for future versions:
- Local storage to persist tasks between sessions
- Customizable timer durations
- Statistics and productivity analytics
- Dark mode toggle
- Sound customization options

## License

Free to use and modify for personal and commercial projects.