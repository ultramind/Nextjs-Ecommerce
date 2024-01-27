import { useEffect, useRef } from "react";
import { FirebaseService } from "../service/firebase";

import { useAddPushNotificationToken } from "@api/authentication";
import { AuthState } from "@atoms/authenticationState";
import { useRecoilValue } from "recoil";
import { COOKIE_KEYS } from "../constants";

//change version when you make an update to the service worker
const serviceWorkerVersion = "0.0.1";

export const useRefreshNotificationToken = (
  userId: string,
  fcm_token: string,
) => {
  const { isLoggedIn } = useRecoilValue(AuthState);
  const lockRef = useRef(false);
  const { mutate, isError } = useAddPushNotificationToken();

  useEffect(() => {
    if (isError) {
      localStorage.removeItem(COOKIE_KEYS.SERVICE_WORKER_VERSION);
    }
  }, [isError]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;

      if (isLoggedIn && userId && !fcm_token) {
        if (!protocol.startsWith("https") && hostname !== "localhost") return;

        try {
          const firebaseService = new FirebaseService();
          // const notificationEnabled = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
          if (lockRef.current) return;

          lockRef.current = true;

          const deviceServiceWorkerVersion = localStorage.getItem(
            COOKIE_KEYS.SERVICE_WORKER_VERSION,
          );

          const deviceUsername = localStorage.getItem(COOKIE_KEYS.USERNAME);

          if (
            deviceServiceWorkerVersion !== serviceWorkerVersion &&
            deviceUsername !== userId
          ) {
            (async () => {
              await firebaseService.unregisterServiceWorker();
              await firebaseService.registerServiceWorker();

              //for service worker version
              localStorage.setItem(
                COOKIE_KEYS.SERVICE_WORKER_VERSION,
                serviceWorkerVersion,
              );

              //for user Id
              localStorage.setItem(COOKIE_KEYS.USERNAME, userId);
              const fcm_token =
                await firebaseService.promptForNotificationPermission();
              // console.log(fcm_token)
              if (typeof fcm_token === "string") {
                mutate({ deviceToken: fcm_token || "", state: true });
                console.log("Service worker updated");
              }
            })();
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [isLoggedIn, userId, fcm_token]);
};

export const useForegroundNotification = () => {
  const lockRef = useRef(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;

      if (!protocol.startsWith("https") && hostname !== "localhost") return;

      // const notificationEnabled = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
      if (lockRef.current) return;

      try {
        const firebaseService = new FirebaseService();
        firebaseService.messageListener();

        lockRef.current = true;
      } catch (error) {
        console.error(error);
      }
    }
  }, []);
};
