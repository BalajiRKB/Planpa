import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const db = await getDatabase();
    const schedulesCollection = db.collection('schedules');
    const blocksCollection = db.collection('timeblocks');

    const query: any = { userId: user.userId };
    if (date) {
      query.date = new Date(date);
    }

    const schedules = await schedulesCollection.find(query).toArray();
    
    // Fetch associated time blocks
    const scheduleIds = schedules.map(s => s.scheduleId);
    const blocks = await blocksCollection.find({ scheduleId: { $in: scheduleIds } }).toArray();

    return NextResponse.json({ schedules, blocks }, { status: 200 });
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, timeBlocks } = await request.json();

    const db = await getDatabase();
    const schedulesCollection = db.collection('schedules');
    const blocksCollection = db.collection('timeblocks');

    const newSchedule = {
      scheduleId: crypto.randomUUID(),
      userId: user.userId,
      date: new Date(date),
      timeBlocks: timeBlocks.map((b: any) => b.blockId),
      totalPlannedTasks: 0,
    };

    await schedulesCollection.insertOne(newSchedule);

    // Insert time blocks
    const blocksToInsert = timeBlocks.map((block: any) => ({
      ...block,
      scheduleId: newSchedule.scheduleId,
      createdAt: new Date(),
    }));
    await blocksCollection.insertMany(blocksToInsert);

    return NextResponse.json({ schedule: newSchedule, blocks: blocksToInsert }, { status: 201 });
  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
