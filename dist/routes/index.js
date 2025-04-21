"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const inquiryRoutes_1 = __importDefault(require("./inquiryRoutes"));
const contactRoutes_1 = __importDefault(require("./contactRoutes"));
const serviceInquiryRoutes_1 = __importDefault(require("./serviceInquiryRoutes"));
const router = express_1.default.Router();
// Mount all product routes under /api/products
router.use('/products', productRoutes_1.default);
// (Other mounts—unchanged)
router.use('/inquiries', inquiryRoutes_1.default);
router.use('/contacts', contactRoutes_1.default);
router.use('/service-inquiries', serviceInquiryRoutes_1.default);
exports.default = router;
