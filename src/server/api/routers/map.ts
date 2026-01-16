import { router, publicProcedure } from "../../trpc/trpc";
import mapPointsData from "@/data/map-points.json";

export const mapRouter = router({
  getPoints: publicProcedure.query(async () => {
    // Retourner tous les points depuis le fichier JSON
    return mapPointsData;
  }),
});