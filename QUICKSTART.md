# PlanPA Quick Start Guide

## 🎉 Welcome to PlanPA!

Your productivity planning app is now up and running. Here's how to use it:

## Getting Started

### 1. First Time Setup
The app runs with a demo user by default. No login required for local development!

### 2. Add Your First Task
1. Look for the **Task Dump** panel on the left
2. Click the **"+ Add Task"** button
3. Fill in:
   - Task title (required)
   - Description (optional)
   - Priority (P1-P4)
   - Estimated duration in minutes
   - Category

### 3. Create Your Schedule
1. Find the **Schedule View** in the middle panel
2. Click **"Create Today's Schedule"**
3. This auto-generates:
   - 8 × 40-minute work blocks
   - 8 × 5-minute break blocks
   - Starting at 9:00 AM

### 4. Drag Tasks to Schedule
1. Click and hold any task in the Task Dump
2. Drag it to a work block in your schedule
3. Drop it! The task is now scheduled

### 5. Start Working
1. Tasks in schedule blocks are ready to work on
2. Use the **Timer** (right panel) to track focus sessions
3. Complete blocks to mark tasks as done

### 6. Monitor Progress
Check the **Dashboard** (right panel, bottom) for:
- Total tasks
- Completed tasks
- Tasks in progress
- Completed time blocks
- Productivity insights

## Features Overview

### Task Dump (Left)
- Add unlimited tasks
- Each task shows priority badge and duration
- Drag tasks to schedule
- Delete tasks with the ✕ button

### Priority Matrix (Left, Bottom)
Visual Eisenhower matrix showing:
- **P1**: Urgent & Important (Do First)
- **P2**: Not Urgent & Important (Schedule)
- **P3**: Urgent & Not Important (Delegate)
- **P4**: Not Urgent & Not Important (Eliminate)

### Schedule View (Middle)
- 40-minute work blocks (blue)
- 5-minute break blocks (green)
- Drag-and-drop task assignment
- Time labels for each block
- Visual completion status

### Timer (Right)
- Focus timer for current block
- Countdown display
- Auto-complete blocks when timer ends
- Start/stop controls

### Dashboard (Right, Bottom)
- Real-time task statistics
- Completion rate
- Total planned work time
- Average task duration

## Tips for Maximum Productivity

1. **Prioritize First**: Use P1 for urgent & important tasks
2. **Realistic Estimates**: Break large tasks into 40-min chunks
3. **Honor Breaks**: Take the 5-minute breaks seriously
4. **Batch Similar Tasks**: Group similar work in adjacent blocks
5. **Review Daily**: Check dashboard to improve planning

## Keyboard Shortcuts (Coming Soon)
- `N` - New task
- `S` - Create schedule
- `Space` - Start/stop timer

## Troubleshooting

### "No schedule created"
Click "Create Today's Schedule" in the middle panel.

### Tasks won't drag
Make sure you're dragging to a **work block** (blue), not a break block.

### Timer not starting
You need to implement the start button in schedule blocks (enhancement).

## What's Next?

### Planned Features
- [ ] Login/Authentication (JWT ready)
- [ ] Multi-day schedules
- [ ] Task templates
- [ ] Export data
- [ ] Dark mode
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Team collaboration

### MongoDB Setup (For Production)
1. Sign up at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planpa
   ```

## Need Help?

- Check the README.md for full documentation
- Report issues on GitHub
- Contact: [Your contact info]

---

Happy planning! 🚀
