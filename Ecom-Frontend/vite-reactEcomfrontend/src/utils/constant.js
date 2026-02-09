/**
 * @file Static image asset imports used across the storefront.
 *
 * Centralizes all slider/banner image imports so consuming modules
 * (`utils/index.js`, page components) reference a single source.
 *
 * @usage utils/index.js — builds `bannerLists` data from these exports.
 *        About.jsx      — uses `aboutUsImage` as the hero background.
 */
import bannerImageOne from "../assets/sliders/flat-lay.jpg";
import bannerImageTwo from "../assets/sliders/people.jpg";
import bannerImageThree from "../assets/sliders/natural-cosmetic.jpg";
import aboutUsImage from "../assets/sliders/team-business.jpg";

/* HERO BANNER IMAGES */
export { bannerImageOne, bannerImageTwo, bannerImageThree };

/* ABOUT US BACKGROUND IMAGE */
export { aboutUsImage };
