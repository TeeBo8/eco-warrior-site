import { useSyncExternalStore } from "react";

const sAbonner = () => () => {};

/**
 * false au rendu serveur et pendant l'hydratation, true ensuite.
 * Remplace le motif `useEffect(() => setMounted(true), [])`.
 */
export function useMonte(): boolean {
  return useSyncExternalStore(
    sAbonner,
    () => true,
    () => false,
  );
}
