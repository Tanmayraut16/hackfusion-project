import React from 'react';
import { 
  Home,
  Vote,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  BarChart3
} from 'lucide-react';

const stats = [
  { label: 'Active Elections', value: '2', icon: Vote, color: 'bg-blue-600' },
  { label: 'Pending Approvals', value: '5', icon: CheckCircle2, color: 'bg-emerald-600' },
  { label: 'Open Complaints', value: '3', icon: AlertCircle, color: 'bg-rose-600' },
  { label: 'Room Bookings', value: '8', icon: Calendar, color: 'bg-violet-600' }
];

const recentActivities = [
  { type: 'Election', title: 'Student Council Elections', status: 'Ongoing', time: '2 days left' },
  { type: 'Approval', title: 'Library Access Extension', status: 'Pending', time: '1 day ago' },
  { type: 'Complaint', title: 'Cafeteria Service', status: 'Under Review', time: '3 hours ago' },
  { type: 'Booking', title: 'Auditorium Booking', status: 'Approved', time: 'Tomorrow' }
];

const StudentDashboard = () => {
  return (
    <div className="min-h-screen text-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        
        {/* Stats Cards - Horizontal Layout */}
        <div className="flex flex-wrap -mx-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
              <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-opacity-80 transition-all hover:translate-y-[-5px]"
                style={{ borderLeftColor: stat.color.replace('bg-', '') }}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <div className={`${stat.color} p-2 rounded-lg opacity-80`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity and Overview Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities - Takes 2/3 of the grid */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activities</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 mr-4">
                    {activity.type === 'Election' && <Vote className="h-6 w-6 text-blue-400" />}
                    {activity.type === 'Approval' && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                    {activity.type === 'Complaint' && <AlertCircle className="h-6 w-6 text-rose-400" />}
                    {activity.type === 'Booking' && <Calendar className="h-6 w-6 text-violet-400" />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.status}</p>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Overview - Takes 1/3 of the grid */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">System Overview</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Active Users */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="ml-3 text-white">Active Users</span>
              </div>
              <span className="text-lg font-bold text-white">1,234</span>
            </div>
            
            {/* System Status Indicators with glow effect */}
            <div className="space-y-6">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-blue-400">
                      System Performance
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-400">
                      95%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div 
                    className="w-[95%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    style={{boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'}}
                  ></div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-emerald-400">
                      Response Time
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-emerald-400">
                      98%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div 
                    className="w-[98%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                    style={{boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;