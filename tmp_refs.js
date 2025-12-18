const fs = require('fs');
const targets = new Map([
  ['app/solutions/dashboard/DashboardDifferentiators.tsx',['bg-gradient-to-b from-white','rounded-[1.7rem]']],
  ['app/solutions/dashboard/DashboardCapabilities.tsx',['Inside the Dashboard','grid grid-cols-1 gap-6 sm:grid-cols-2']],
  ['app/solutions/dashboard/DashboardMethodology.tsx',['Scalable Data You Can Trust','const stats']],
  ['app/solutions/dashboard/DashboardUseCases.tsx',['Built for Decision-Makers','const useCases']],
  ['app/solutions/dashboard/DashboardAccess.tsx',['Always-On Access','const highlights']],
  ['app/solutions/dashboard/DashboardAccessCTA.tsx',['Ready to Get Your Team Inside?']],
  ['app/solutions/dashboard/DashboardDemo.tsx',['bg-gradient-to-b from[#','Demo Video']],
]);
for (const [file, needles] of targets.entries()) {
  const lines = fs.readFileSync(file,'utf8').split(/\r?\n/);
  console.log(file);
  for (const needle of needles) {
    const idx = lines.findIndex(line =
    if (idx !== -1) {
      console.log('  ' + (idx + 1) + ': ' + lines[idx].trim());
    }
  }
  console.log();
}
