import React from 'react';
import { 
  Home,
  Vote,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

const stats = [
  { label: 'Active Elections', value: '2', icon: Vote, color: 'bg-blue-500' },
  { label: 'Pending Approvals', value: '5', icon: CheckCircle2, color: 'bg-green-500' },
  { label: 'Open Complaints', value: '3', icon: AlertCircle, color: 'bg-red-500' },
  { label: 'Room Bookings', value: '8', icon: Calendar, color: 'bg-purple-500' }
];

const recentActivities = [
  { type: 'Election', title: 'Student Council Elections', status: 'Ongoing', time: '2 days left' },
  { type: 'Approval', title: 'Library Access Extension', status: 'Pending', time: '1 day ago' },
  { type: 'Complaint', title: 'Cafeteria Service', status: 'Under Review', time: '3 hours ago' },
  { type: 'Booking', title: 'Auditorium Booking', status: 'Approved', time: 'Tomorrow' }
];

const StudentDashboard = () => {
  return (
    <div className="min-h-screen ">

      {/* Main Content */}
      <main className="max-w-7xl  sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity and Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {activity.type === 'Election' && <Vote className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'Approval' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {activity.type === 'Complaint' && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {activity.type === 'Booking' && <Calendar className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.status}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trends and Analytics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              {/* Active Users */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Active Users</span>
                </div>
                <span className="text-sm font-medium text-gray-900">1,234</span>
              </div>
              
              {/* System Status Indicators */}
              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        System Performance
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        95%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div className="w-[95%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-green-600">
                        Response Time
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        98%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                    <div className="w-[98%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                  </div>
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
