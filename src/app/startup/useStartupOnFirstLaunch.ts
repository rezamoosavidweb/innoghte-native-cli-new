import { useEffect } from 'react';

import { STARTUP_SEEN_KEY } from '@/shared/infra/persistence/appStorageKeys';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';
import { StorageService } from '@/shared/infra/storage/storage.service';

/**
 * Navigates to the Startup screen exactly once — on the very first app launch.
 * Subsequent launches skip it because `STARTUP_SEEN_KEY` is persisted in MMKV.
 *
 * Call this inside `AppNavigation` (after the NavigationContainer is rendered
 * so `navigationRef` is attached).
 */
export function useStartupOnFirstLaunch(): void {
  useEffect(() => {
    if (StorageService.get<boolean>(STARTUP_SEEN_KEY)) return;

    const nav = navigationRef.current;
    if (!nav) return;

    const navigate = () => navigationRef.navigate('Startup');

    if (nav.isReady()) {
      navigate();
    } else {
      const unsub = nav.addListener('state', () => {
        if (!navigationRef.current?.isReady()) return;
        unsub();
        navigate();
      });
    }
  }, []);
}

/**
 * Marks the startup screen as seen so it never auto-shows again.
 * Call this from every CTA that dismisses the startup screen.
 */
export function markStartupSeen(): void {
  StorageService.set(STARTUP_SEEN_KEY, true);
}
