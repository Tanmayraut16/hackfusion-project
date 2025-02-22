export const elections = {
    ongoing: [
      {
        id: '1',
        title: 'Student Council Elections 2024',
        startDate: '2024-03-15',
        endDate: '2024-03-20',
        positions: [
          {
            id: 'p1',
            title: 'Student Body President',
            description: 'Lead the student council and represent student interests',
            candidates: [
              {
                id: 'c1',
                name: 'Alex Johnson',
                department: 'Computer Science',
                description: 'Passionate about improving student life and campus facilities',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
              },
              {
                id: 'c2',
                name: 'Sarah Chen',
                department: 'Business Administration',
                description: 'Focused on promoting diversity and inclusion initiatives',
                imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop',
              },
            ],
          },
        ],
      },
    ],
    upcoming: [
      {
        id: '2',
        title: 'Department Representative Elections',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        positions: [
          {
            id: 'p2',
            title: 'CS Department Representative',
            description: 'Represent CS department in student council',
            candidates: [
              {
                id: 'c3',
                name: 'Mike Smith',
                department: 'Computer Science',
                description: 'Working to bridge the gap between students and faculty',
                imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop',
              },
            ],
          },
        ],
      },
    ],
    done: [
      {
        id: '3',
        title: 'Club President Elections',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        positions: [
          {
            id: 'p3',
            title: 'Tech Club President',
            description: 'Lead the college tech community',
            candidates: [
              {
                id: 'c4',
                name: 'Emily Wilson',
                department: 'Computer Engineering',
                description: 'Committed to organizing more tech events and workshops',
                imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop',
                votes: 245,
              },
              {
                id: 'c5',
                name: 'David Park',
                department: 'Computer Science',
                description: 'Planning to establish industry connections',
                imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop',
                votes: 189,
              },
            ],
          },
        ],
      },
    ],
  };
  