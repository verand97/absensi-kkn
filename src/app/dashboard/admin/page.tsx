import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

import { getCurrentDayFromStartDate } from "@/lib/dateUtils";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.member.findUnique({
    where: { id: session.user.id }
  });

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  const autoDay = getCurrentDayFromStartDate();
  let setting = await prisma.setting.findUnique({ where: { id: "global" } });
  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: false, currentDay: autoDay }
    });
  } else if (setting.currentDay !== autoDay) {
    setting = await prisma.setting.update({
      where: { id: "global" },
      data: { currentDay: autoDay, isActive: false }
    });
  }

  const members = await prisma.member.findMany({
    include: { attendances: true },
    orderBy: { name: 'asc' }
  });

  const formattedMembers = members.map((m) => ({
    ...m,
    attendances: m.attendances.map((a) => ({
      ...a,
      createdAt: a.createdAt ? a.createdAt.toISOString() : undefined,
    })),
  }));

  return (
    <AdminDashboardClient setting={setting} members={formattedMembers} />
  );
}
