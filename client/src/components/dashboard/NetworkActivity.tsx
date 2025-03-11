import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

type ActivityUser = {
  username: string;
  displayName: string;
  avatarInitials: string;
  company: string;
};

type ActivityItem = {
  id: number;
  userId: number;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  user: ActivityUser;
};

export default function NetworkActivity() {
  const { data: activities = [], isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['/api/activities'],
  });

  if (isLoading) {
    return (
      <section className="lg:col-span-2 bg-deep-space border border-resistance-red p-4">
        <div className="border-b border-resistance-red pb-2 mb-4">
          <h2 className="text-lg font-bold">NETWORK ACTIVITY <span className="text-xs text-matrix-green">[LOADING]</span></h2>
        </div>
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-void-black border border-matrix-green p-3 h-32"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-2 bg-deep-space border border-resistance-red p-4">
      <div className="border-b border-resistance-red pb-2 mb-4">
        <h2 className="text-lg font-bold">NETWORK ACTIVITY <span className="text-xs text-matrix-green">[ENCRYPTED]</span></h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          // Parse the date string into a Date object
          const createdAt = new Date(activity.createdAt);
          
          // Format the relative time (e.g., "3 hours ago")
          const timeAgo = formatDistanceToNow(createdAt, { addSuffix: false });
          
          return (
            <div key={activity.id} className="bg-void-black border border-matrix-green p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-resistance-red flex items-center justify-center text-void-black font-bold mt-1">
                  {activity.user.avatarInitials}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">#{activity.user.username}</span>
                      <span className="text-matrix-green ml-1">@{activity.user.company}</span>
                    </div>
                    <span className="text-xs text-gray-400">{timeAgo} ago</span>
                  </div>
                  <p className="mt-1 text-sm opacity-90">
                    {activity.content}
                    {activity.tags.map(tag => (
                      <span key={tag} className="text-resistance-red"> #{tag}</span>
                    ))}
                  </p>
                  <div className="flex space-x-4 mt-2 text-xs text-gray-400">
                    <button className="hover:text-matrix-green">
                      <i className="far fa-comment"></i> {activity.comments}
                    </button>
                    <button className="hover:text-matrix-green">
                      <i className="far fa-heart"></i> {activity.likes}
                    </button>
                    <button className="hover:text-matrix-green">
                      <i className="fas fa-retweet"></i> {activity.shares}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="text-center">
          <button className="text-sm text-matrix-green hover:underline">Load more entries_</button>
        </div>
      </div>
    </section>
  );
}
