import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

type Notification = {
  id: number;
  userId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionLabel?: string;
  actionUrl?: string;
};

export default function NotificationPanel() {
  const { user } = useAuth();
  
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: [`/api/notifications/${user?.id}`],
    enabled: !!user,
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notifications/${user?.id}`] });
    },
  });
  
  const handleAction = (notification: Notification) => {
    // Mark notification as read when action is taken
    markAsReadMutation.mutate(notification.id);
    
    // Handle the specific action based on the type
    if (notification.actionUrl) {
      window.open(notification.actionUrl, "_blank");
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: false });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (isLoading) {
    return (
      <section className="bg-deep-space border border-resistance-red p-4">
        <div className="border-b border-resistance-red pb-2 mb-4">
          <h2 className="text-lg font-bold">NOTIFICATIONS <span className="text-xs text-resistance-red">[LOADING]</span></h2>
        </div>
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-void-black border border-matrix-green p-3 h-24"></div>
          ))}
        </div>
      </section>
    );
  }
  
  if (!user) {
    return (
      <section className="bg-deep-space border border-resistance-red p-4">
        <div className="border-b border-resistance-red pb-2 mb-4">
          <h2 className="text-lg font-bold">NOTIFICATIONS</h2>
        </div>
        <p className="text-matrix-green">Login to view your notifications.</p>
      </section>
    );
  }
  
  return (
    <section className="bg-deep-space border border-resistance-red p-4">
      <div className="border-b border-resistance-red pb-2 mb-4">
        <h2 className="text-lg font-bold">
          NOTIFICATIONS {unreadCount > 0 && (
            <span className="text-xs text-resistance-red">[{unreadCount} NEW]</span>
          )}
        </h2>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${
              notification.read 
                ? 'bg-void-black border border-matrix-green' 
                : 'bg-resistance-red bg-opacity-20 border-l-4 border-resistance-red'
            } p-3`}
          >
            <div className="flex justify-between">
              <span className={`text-xs ${notification.read ? 'text-matrix-green' : 'text-resistance-red'}`}>
                {notification.type}
              </span>
              <span className="text-xs">{getTimeAgo(notification.createdAt)} ago</span>
            </div>
            <p className="text-sm mt-1">{notification.message}</p>
            {notification.actionLabel && (
              <div className="flex space-x-2 mt-2">
                <Button 
                  onClick={() => handleAction(notification)}
                  className={`text-xs ${
                    notification.read 
                      ? 'bg-transparent border border-matrix-green text-matrix-green' 
                      : 'bg-matrix-green text-void-black'
                  } px-2 py-1`}
                >
                  {notification.actionLabel}
                </Button>
              </div>
            )}
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="bg-void-black border border-matrix-green p-3">
            <p className="text-sm">No notifications yet. Your network activity will appear here.</p>
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-matrix-green hover:underline">View all notifications_</button>
        </div>
      )}
    </section>
  );
}
