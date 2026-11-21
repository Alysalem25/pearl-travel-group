"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface InquiryNotification {
  id: string;
  category: string;
  path: string;
  createdAt: string;
  read: boolean;
}

interface InquiryNotificationResponse {
  checkedAt: string;
  inquiries: Omit<InquiryNotification, "read">[];
}

const inquiryPermissions = [
  "manage_booked_flights",
  "manage_booked_programs",
  "manage_booked_cruises",
  "manage_visa",
  "manage_booked_transportation",
  "manage_booked_hotels",
  "manage_booked_mice"
];

const POLL_INTERVAL_MS = 30_000;

function playInquiryNotificationSound(audioContext: AudioContext, onStarted: () => void) {
  const play = () => {
    try {
      [880, 1174].forEach((frequency, index) => {
        const startTime = audioContext.currentTime + index * 0.16;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.14);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      });
      onStarted();
    } catch (error) {
      console.error("Unable to play inquiry notification sound", error);
    }
  };

  if (audioContext.state === "running") {
    play();
    return;
  }

  void audioContext.resume().then(() => {
    if (audioContext.state === "running") play();
  }).catch((error: unknown) => {
    console.error("Unable to resume inquiry notification sound", error);
  });
}

function showInquiryBrowserNotification(body: string) {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return null;
  }

  try {
    return new Notification("New inquiry received", {
      body,
      icon: "/Logo.png",
      tag: `new-inquiry-${Date.now()}`,
      silent: false
    });
  } catch (error) {
    console.error("Unable to show inquiry browser notification", error);
    return null;
  }
}

export default function AdminInquiryNotifications() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsByUser, setNotificationsByUser] = useState<Record<string, InquiryNotification[]>>({});
  const [latestNotification, setLatestNotification] = useState<
    (InquiryNotification & { userId: string }) | null
  >(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pollingError, setPollingError] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const audioContextRef = useRef<AudioContext | null>(null);
  const pendingSoundRef = useRef(false);
  const notificationPermissionRequestedRef = useRef(false);

  const isAdminArea = pathname.startsWith("/Admindashbord");
  const canViewInquiries = user?.role === "admin" ||
    Boolean(user?.permissions?.some((permission) => inquiryPermissions.includes(permission)));
  const notifications = user?.id ? notificationsByUser[user.id] || [] : [];
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    setNotificationPermission(
      "Notification" in window ? Notification.permission : "unsupported"
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isAdminArea || !canViewInquiries) return;

    const unlockAudio = () => {
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission);
        if (
          Notification.permission === "default" &&
          !notificationPermissionRequestedRef.current
        ) {
          notificationPermissionRequestedRef.current = true;
          void Notification.requestPermission()
            .then(setNotificationPermission)
            .catch((error: unknown) => {
              console.error("Unable to request inquiry notification permission", error);
            });
        }
      } else {
        setNotificationPermission("unsupported");
      }

      if (typeof window.AudioContext === "undefined") return;

      try {
        const audioContext = audioContextRef.current ?? new window.AudioContext();
        audioContextRef.current = audioContext;

        const playPendingSound = () => {
          if (!pendingSoundRef.current) return;
          playInquiryNotificationSound(audioContext, () => {
            pendingSoundRef.current = false;
          });
        };

        if (audioContext.state === "running") {
          playPendingSound();
        } else {
          void audioContext.resume().then(playPendingSound).catch((error: unknown) => {
            console.error("Unable to enable inquiry notification sound", error);
          });
        }
      } catch (error) {
        console.error("Unable to enable inquiry notification sound", error);
      }
    };

    document.addEventListener("pointerdown", unlockAudio);
    document.addEventListener("keydown", unlockAudio);
    return () => {
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, [canViewInquiries, isAdminArea, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !isAdminArea || !canViewInquiries) return;

    let active = true;
    let requestInProgress = false;
    const cursorKey = `inquiry-notification-cursor:${user.id}`;

    let cursor: string | undefined;
    try {
      cursor = sessionStorage.getItem(cursorKey) || undefined;
    } catch {
      cursor = undefined;
    }

    const checkForInquiries = async () => {
      if (!active || requestInProgress) return;
      requestInProgress = true;

      try {
        const response = await api.notifications.getNewInquiries(cursor);
        if (!active) return;

        const result = response.data as InquiryNotificationResponse;
        cursor = result.checkedAt;
        try {
          sessionStorage.setItem(cursorKey, cursor);
        } catch {
          setPollingError(true);
        }

        setPollingError(false);
        const newNotifications = result.inquiries.map((inquiry) => ({
          ...inquiry,
          read: false
        }));

        if (newNotifications.length > 0) {
          pendingSoundRef.current = true;
          const newest = [...newNotifications].sort(
            (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
          )[0];
          const browserNotification = document.visibilityState === "hidden"
            ? showInquiryBrowserNotification(
                newNotifications.length === 1
                  ? `New ${newest.category} inquiry`
                  : `${newNotifications.length} new inquiries received`
              )
            : null;

          if (browserNotification) {
            browserNotification.onclick = () => {
              window.focus();
              router.push(newest.path);
              browserNotification.close();
            };
            pendingSoundRef.current = false;
          } else {
            const audioContext = audioContextRef.current;
            if (audioContext) {
              playInquiryNotificationSound(audioContext, () => {
                pendingSoundRef.current = false;
              });
            }
          }
          setNotificationsByUser((currentByUser) => {
            const current = currentByUser[user.id] || [];
            const existingIds = new Set(current.map((notification) => notification.id));
            const uniqueNewNotifications = newNotifications.filter(
              (notification) => !existingIds.has(notification.id)
            );
            const updated = [...uniqueNewNotifications, ...current].slice(0, 50);
            return { ...currentByUser, [user.id]: updated };
          });

          setLatestNotification({ ...newest, userId: user.id });
        }
      } catch {
        if (active) setPollingError(true);
      } finally {
        requestInProgress = false;
      }
    };

    void checkForInquiries();
    const interval = setInterval(checkForInquiries, POLL_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkForInquiries();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [canViewInquiries, isAdminArea, isAuthenticated, router, user?.id]);

  useEffect(() => {
    if (!latestNotification) return;
    const timer = setTimeout(() => {
      setLatestNotification((current) =>
        current?.id === latestNotification.id &&
        current.userId === latestNotification.userId
          ? null
          : current
      );
    }, 8_000);
    return () => clearTimeout(timer);
  }, [latestNotification]);

  const visibleLatestNotification = latestNotification?.userId === user?.id
    ? latestNotification
    : null;

  if (!isAuthenticated || !isAdminArea || !canViewInquiries) return null;

  const markAllAsRead = () => {
    if (!user?.id) return;
    setNotificationsByUser((currentByUser) => ({
      ...currentByUser,
      [user.id]: (currentByUser[user.id] || []).map((notification) => ({
        ...notification,
        read: true
      }))
    }));
    setLatestNotification(null);
  };

  const openInquiry = (notification: InquiryNotification) => {
    if (user?.id) {
      setNotificationsByUser((currentByUser) => ({
        ...currentByUser,
        [user.id]: (currentByUser[user.id] || []).map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      }));
    }
    setLatestNotification(null);
    setPanelOpen(false);
    router.push(notification.path);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {visibleLatestNotification && (
        <div
          className="flex w-[min(22rem,calc(100vw-2.5rem))] items-start gap-3 rounded-xl border border-blue-200 bg-white p-4 shadow-xl"
          role="status"
        >
          <button
            type="button"
            onClick={() => openInquiry(visibleLatestNotification)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
          >
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-slate-900">New inquiry received</span>
              <span className="mt-1 block text-sm text-slate-600">
                New {visibleLatestNotification.category} inquiry
              </span>
            </span>
          </button>
          <span
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setLatestNotification(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        </div>
      )}

      {panelOpen && (
        <section
          aria-label="Inquiry notifications"
          className="w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="font-semibold text-slate-900">Inquiry notifications</h2>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-medium text-blue-700 hover:text-blue-900"
            >
              Mark all read
            </button>
          </header>
          {pollingError && (
            <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-800" role="status">
              Notifications are temporarily unavailable. Retrying automatically.
            </p>
          )}
          {notificationPermission === "denied" && (
            <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-800" role="status">
              Browser notifications are blocked. Allow them in this site&apos;s browser settings to receive background alerts.
            </p>
          )}
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-500">
                No new inquiries yet.
              </li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => openInquiry(notification)}
                    className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                      notification.read ? "" : "bg-blue-50/60"
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        notification.read ? "bg-transparent" : "bg-blue-600"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">
                        New {notification.category} inquiry
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      )}

      <button
        type="button"
        onClick={() => setPanelOpen((open) => !open)}
        aria-label={`Inquiry notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={panelOpen}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition hover:bg-blue-800"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
