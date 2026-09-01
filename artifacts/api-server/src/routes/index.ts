import { Router, type IRouter } from "express";
import healthRouter from "./health";
import siteContentRouter from "./site-content";
import galleryRouter from "./gallery";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(siteContentRouter);
router.use(galleryRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
