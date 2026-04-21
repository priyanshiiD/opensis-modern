import { useEffect, useState } from "react";
import Layout from "../../../shared/components/Layout";
import { useAuth } from "../../auth/context/AuthContext";
import { apiBaseUrl } from "../../../shared/config/env";

function StatCard({ title, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: accent + '18', color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">
          {value === null ? <span className="text-gray-300 text-lg">—</span> : value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const DashboardPage = () => {
  const { getAccessToken } = useAuth();
  const [stats, setStats] = useState({ students: null, teachers: null, classes: null, activeClasses: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const token = getAccessToken();
      if (!token) return;

      try {
        const [studentsRes, teachersRes, classesRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/students?limit=1`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBaseUrl}/api/teachers?limit=1`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBaseUrl}/api/classes?limit=1`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [studentsJson, teachersJson, classesJson] = await Promise.all([
          studentsRes.json(),
          teachersRes.json(),
          classesRes.json(),
        ]);

        const activeClassesRes = await fetch(`${apiBaseUrl}/api/classes?limit=1&status=Active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const activeClassesJson = await activeClassesRes.json();

        setStats({
          students: studentsJson.data?.pagination?.total ?? null,
          teachers: teachersJson.data?.pagination?.total ?? null,
          classes: classesJson.data?.pagination?.total ?? null,
          activeClasses: activeClassesJson.data?.pagination?.total ?? null,
        });
      } catch {
        // silently fail — shows dashes
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Students',
      value: isLoading ? '...' : stats.students,
      sub: 'Enrolled in the system',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      accent: '#4f46e5',
    },
    {
      title: 'Total Teachers',
      value: isLoading ? '...' : stats.teachers,
      sub: 'Active staff members',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
          <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      accent: '#0891b2',
    },
    {
      title: 'Total Classes',
      value: isLoading ? '...' : stats.classes,
      sub: 'Across all grade levels',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      accent: '#16a34a',
    },
    {
      title: 'Active Classes',
      value: isLoading ? '...' : stats.activeClasses,
      sub: 'Currently running',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      accent: '#d97706',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Overview of your school system</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Add Student', href: '/students', desc: 'Enroll a new student' },
              { label: 'Add Teacher', href: '/teachers', desc: 'Register a new teacher' },
              { label: 'Create Class', href: '/classes', desc: 'Set up a new class' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex flex-col gap-0.5 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{link.label}</span>
                <span className="text-xs text-gray-400">{link.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
