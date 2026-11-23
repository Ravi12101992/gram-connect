import { NextResponse } from 'next/server';
import { getComplaintsServer, createComplaintAction } from '@/actions/complaints';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const ward = searchParams.get('ward');
  const search = searchParams.get('search')?.toLowerCase();

  let complaints = await getComplaintsServer();

  if (status && status !== 'ALL') {
    complaints = complaints.filter((c) => c.status === status);
  }
  if (category && category !== 'ALL') {
    complaints = complaints.filter((c) => c.category === category);
  }
  if (ward && ward !== 'ALL') {
    complaints = complaints.filter((c) => c.ward.includes(ward));
  }
  if (search) {
    complaints = complaints.filter(
      (c) =>
        c.id.toLowerCase().includes(search) ||
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.ward.toLowerCase().includes(search) ||
        c.landmark.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ success: true, data: complaints });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createComplaintAction(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 400 });
  }
}
