import { NextRequest, NextResponse } from 'next/server';

import { getAdminOverview } from '@/features/admin/services/dashboard';
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

    const data = await getAdminOverview(startDate, endDate);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AdminRouteAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : 'Erro ao carregar a visão geral.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
