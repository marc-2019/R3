import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'status':
        // Get system status
        const { stdout: statusOutput } = await execAsync('./scripts/data-tools.sh check');
        return NextResponse.json(JSON.parse(statusOutput));

      case 'backups':
        // Get backup history
        const { stdout: backupsOutput } = await execAsync('./scripts/data-management.sh list');
        return NextResponse.json(JSON.parse(backupsOutput));

      case 'health':
        // Get health metrics
        const { stdout: healthOutput } = await execAsync('./scripts/data-tools.sh monitor');
        return NextResponse.json(JSON.parse(healthOutput));

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Data management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { action, backupId } = await req.json();

  try {
    switch (action) {
      case 'backup':
        // Trigger backup
        await execAsync('./scripts/data-management.sh backup');
        return NextResponse.json({ message: 'Backup initiated' });

      case 'restore':
        // Restore from backup
        if (!backupId) {
          return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
        }
        await execAsync(`./scripts/data-management.sh restore ${backupId}`);
        return NextResponse.json({ message: 'Restore initiated' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Data management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
