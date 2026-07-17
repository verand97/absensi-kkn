import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

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

  let setting = await prisma.setting.findUnique({ where: { id: "global" } });
  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: true }
    });
  }

  const members = await prisma.member.findMany({
    include: { attendances: true },
    orderBy: { name: 'asc' }
  });

  return (
    <AdminDashboardClient setting={setting} members={members} />
  );
}
