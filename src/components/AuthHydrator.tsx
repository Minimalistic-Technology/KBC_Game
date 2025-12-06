// AuthHydrator.tsx (client)
"use client";
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { loggedInUserAtom, authHydratedAtom } from "@/state/auth";
import { fetchMe } from "@/lib/authClient";

export default function AuthHydrator() {
  const [currentRole, setCurrentRole] = useAtom(loggedInUserAtom);
  const setHydrated = useSetAtom(authHydratedAtom);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { ok, data } = await fetchMe();
        if (!mounted) return;

        // Only set if server has a role OR we don't already have a role in memory
        if (data?.role) {
          setCurrentRole(data.role);
          console.log(data.role)
        } else {
          // if client already has role (just logged in), don't overwrite it with null
          if (!currentRole) {
            setCurrentRole(null);
          }
        }
      } catch (err) {
        if (!currentRole) setCurrentRole(null);
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => { mounted = false; };
  }, []); // run only once
  return null;
}
