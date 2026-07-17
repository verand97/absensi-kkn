const fs = require('fs');
const replacements = {
    'bg-[#0B0D14]': 'bg-slate-50 dark:bg-[#0B0D14]',
    'text-white': 'text-slate-900 dark:text-white',
    'bg-[#12141C]': 'bg-white dark:bg-[#12141C]',
    'bg-[#101217]': 'bg-slate-100 dark:bg-[#101217]',
    'bg-[#090A0F]': 'bg-slate-200 dark:bg-[#090A0F]',
    'border-slate-700/50': 'border-slate-200 dark:border-slate-700/50',
    'border-slate-700': 'border-slate-300 dark:border-slate-700',
    'border-slate-800': 'border-slate-200 dark:border-slate-800',
    'bg-slate-700/50': 'bg-slate-200 dark:bg-slate-700/50',
    'text-slate-400': 'text-slate-600 dark:text-slate-400',
    'text-slate-300': 'text-slate-700 dark:text-slate-300',
    'text-slate-500': 'text-slate-500 dark:text-slate-500', 
    'bg-[#1A1C23]': 'bg-slate-100 dark:bg-[#1A1C23]',
    'bg-slate-800': 'bg-slate-200 dark:bg-slate-800',
    'border-white/10': 'border-slate-300 dark:border-white/10',
    'bg-white/5': 'bg-slate-200/50 dark:bg-white/5'
};

const files = [
    'src/app/page.tsx',
    'src/app/login/page.tsx',
    'src/app/dashboard/MemberDashboard.tsx',
    'src/app/dashboard/MemberAccountSettings.tsx',
    'src/app/dashboard/LogoutButton.tsx',
    'src/app/dashboard/SettingsPanel.tsx',
    'src/app/dashboard/ResetAttendanceButton.tsx',
    'src/app/dashboard/DeleteMemberAttendanceButton.tsx',
    'src/app/dashboard/admin/AdminDashboardClient.tsx'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        if (content.includes('dark:bg-[#0B0D14]')) return;
        for (const [oldVal, newVal] of Object.entries(replacements)) {
            content = content.split(oldVal).join(newVal);
        }
        fs.writeFileSync(file, content, 'utf-8');
        console.log('Processed', file);
    }
});
