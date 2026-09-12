'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useNotifications } from '@/hooks/useNotifications';
import { timeAgo, cn } from '@/lib/utils';
import Link from 'next/link';

const TYPE_ICONS: Record<string, string> = {
  order_placed: '🛍️', order_confirmed: '✅', order_shipped: '🚚',
  order_delivered: '📦', order_cancelled: '❌', payment_success: '💳',
  payment_failed: '⚠️', review_approved: '⭐', back_in_stock: '🌿',
  coupon_expired: '🏷️', system: '🔔', promotional: '🎁',
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiBell className="text-primary-600" /> Notifications
          {unreadCount > 0 && (
            <span className="w-6 h-6 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button onClick={() => markAllAsRead()} className="text-sm text-primary-600 hover:underline flex items-center gap-1.5">
            <FiCheck className="text-xs" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft text-center py-16">
          <FiBell className="text-5xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">We&apos;ll notify you about orders, offers, and updates</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <AnimatePresence initial={false}>
            {notifications.map((notif: any) => (
              <motion.div
                key={notif._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={cn(
                  'flex items-start gap-4 p-4 border-b border-gray-50 last:border-0 transition-colors',
                  !notif.isRead ? 'bg-primary-50/50' : 'hover:bg-gray-50'
                )}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-soft flex-shrink-0">
                  {TYPE_ICONS[notif.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn('text-sm font-medium', !notif.isRead ? 'text-gray-900' : 'text-gray-700')}>
                        {notif.title}
                        {!notif.isRead && <span className="ml-2 inline-block w-2 h-2 bg-primary-600 rounded-full" />}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {!notif.isRead && (
                        <button onClick={() => markAsRead(notif._id)}
                          className="p-1.5 hover:bg-primary-100 rounded-lg text-gray-400 hover:text-primary-600 transition-colors"
                          title="Mark as read">
                          <FiCheck className="text-xs" />
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif._id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete">
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
                    {notif.link && (
                      <Link href={notif.link} className="text-xs text-primary-600 hover:underline">
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
