import { NextRequest, NextResponse } from 'next/server';

import { getAdminSessions } from '@/features/admin/services/dashboard';
import { AdminRouteAuthError, requireAdminUser } from '@/features/admin/services/route-auth';
import { parseAdminDateRange } from '@/features/admin/utils/date';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser(request);

    const { startDate, endDate } = parseAdminDateRange({
      startDate: request.nextUrl.searchParams.get('startDate'),
      endDate: request.nextUrl.searchParams.get('endDate'),
    });

    const data = await getAdminSessions({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      sexo: request.nextUrl.searchParams.get('sexo') ?? undefined,
      atividade: request.nextUrl.searchParams.get('atividade') ?? undefined,
      minScore: request.nextUrl.searchParams.get('minScore') ?? undefined,
      maxScore: request.nextUrl.searchParams.get('maxScore') ?? undefined,
      page: request.nextUrl.searchParams.get('page') ?? undefined,
      pageSize: request.nextUrl.searchParams.get('pageSize') ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AdminRouteAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : 'Erro ao carregar as sessões.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
