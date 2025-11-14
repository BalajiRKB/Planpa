# PlanPA - Productivity Planning App

A research-backed single-page productivity planning web app built with Next.js that helps users balance work and rest through visual task management with 40-minute work blocks and 5-minute breaks.

## 🚀 Features

- **Task Dump** - Add tasks with priority (P1-P4), duration, and category
- **Visual Schedule** - 40-minute work blocks + 5-minute breaks
- **Drag-and-Drop** - Move tasks from dump to schedule seamlessly
- **Priority Matrix** - Eisenhower matrix (Urgent/Important)
- **Timer & Sessions** - Focus timer with break reminders
- **Dashboard** - Productivity metrics and analytics
- **Single Page App** - All tools accessible in one view

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB Atlas
- **Drag-and-Drop:** @dnd-kit
- **State Management:** React Context API
- **Authentication:** JWT with bcryptjs

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/BalajiRKB/Planpa.git
cd planpa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/planpa
JWT_SECRET=your-super-secret-jwt-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

1. Create a free MongoDB Atlas account at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new cluster
3. Get your connection string and add it to `.env.local`
4. The app will automatically create collections on first use

### Collections:
- `users` - User accounts and preferences
- `tasks` - All tasks with priority and status
- `schedules` - Daily schedules
- `timeblocks` - Individual 40/5 minute blocks

## 🎯 Usage

1. **Add Tasks:** Click "+ Add Task" in the Task Dump section
2. **Create Schedule:** Click "Create Today's Schedule" to generate work/break blocks
3. **Drag Tasks:** Drag tasks from the dump to schedule blocks
4. **Start Timer:** Click on a block to start the focus timer
5. **Track Progress:** View your productivity metrics in the Dashboard

## 📊 Data Models

### User
- `userId`, `email`, `name`, `preferences` (work/break duration, timezone, notifications)

### Task
- `taskId`, `title`, `description`, `priority` (P1-P4), `estimatedDuration`, `status`, `category`

### TimeBlock
- `blockId`, `startTime`, `endTime`, `duration` (40 or 5 min), `blockType` (Work/Break), `assignedTasks`

### Schedule
- `scheduleId`, `date`, `timeBlocks`, `totalPlannedTasks`

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker
```bash
docker build -t planpa .
docker run -p 3000:3000 --env-file .env.local planpa
```

## 📝 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks` - Update task
- `DELETE /api/tasks` - Delete task
- `GET /api/schedules` - Get schedules
- `POST /api/schedules` - Create schedule

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Balaji RKB**
- GitHub: [@BalajiRKB](https://github.com/BalajiRKB)

## 🙏 Acknowledgments

- Based on research showing 40-minute work blocks optimize focus and retention
- Inspired by the Pomodoro Technique and Eisenhower Matrix
- Built with Next.js and modern web technologies

---

Made with ❤️ for better productivity
