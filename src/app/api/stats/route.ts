import { NextResponse } from 'next/server';
import { getComplaintsServer } from '@/actions/complaints';

export async function GET() {
  const complaints = await getComplaintsServer();

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'PENDING' || c.status === 'REVIEWED').length;
  const inProgress = complaints.filter((c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
  const completed = complaints.filter((c) => c.status === 'COMPLETED' || c.status === 'VERIFIED_CLOSED').length;
  
  // Overdue: targetDate < today and status not in (COMPLETED, VERIFIED_CLOSED)
  const today = new Date().toISOString().split('T')[0];
  const overdue = complaints.filter(
    (c) => c.targetDate && c.targetDate < today && c.status !== 'COMPLETED' && c.status !== 'VERIFIED_CLOSED'
  ).length;

  return NextResponse.json({
    total,
    pending,
    inProgress,
    completed,
    overdue,
  });
}
