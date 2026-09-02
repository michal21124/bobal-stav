import { Router, type IRouter } from "express";
import healthRouter from "./health";
import siteContentRouter from "./site-content";
import galleryRouter from "./gallery";
import adminRouter from "./admin";
import storageRouter from "./storage";
import contactRouter from "./contact";
import testimonialsRouter from "./testimonials";

const router: IRouter = Router();

router.use(healthRouter);
router.use(siteContentRouter);
router.use(galleryRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(contactRouter);
router.use(testimonialsRouter);

export default router;
