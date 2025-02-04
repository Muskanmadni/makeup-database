"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var sanityClient_js_1 = require("../sanityClient.js"); // Import your Sanity client
var slugify_1 = require("slugify");
function uploadImageToSanity(imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, buffer, asset, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("Fetching image:", imageUrl);
                    return [4 /*yield*/, axios_1.default.get(imageUrl, { responseType: 'arraybuffer', timeout: 10000 })];
                case 1:
                    response = _a.sent();
                    console.log("Image fetch successful:", imageUrl, response.status);
                    buffer = Buffer.from(response.data);
                    return [4 /*yield*/, sanityClient_js_1.client.assets.upload('image', buffer, {
                            filename: imageUrl.split('/').pop(),
                        })];
                case 2:
                    asset = _a.sent();
                    console.log('Image uploaded successfully:', asset);
                    return [2 /*return*/, asset._id];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Failed to fetch/upload image:', imageUrl);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createCategory(category, counter) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryExist, catObj, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("Creating category:", category);
                    return [4 /*yield*/, sanityClient_js_1.client.fetch("*[_type==\"category\" && slug==$slug][0]", { slug: category.slug })];
                case 1:
                    categoryExist = _a.sent();
                    console.log("Category exists check:", categoryExist);
                    if (categoryExist) {
                        return [2 /*return*/, categoryExist._id];
                    }
                    catObj = {
                        _type: "category",
                        _id: category.slug + "-" + counter,
                        name: category.name,
                        slug: category.slug
                    };
                    return [4 /*yield*/, sanityClient_js_1.client.createOrReplace(catObj)];
                case 2:
                    response = _a.sent();
                    console.log('Category created successfully', response);
                    return [2 /*return*/, response._id];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Failed to create category:', category.name, error_2);
                    return [2 /*return*/, null]; // Return null on error
                case 4: return [2 /*return*/];
            }
        });
    });
}
function importData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, products, counter, _i, products_1, product, imageRef, catRef, imageError_1, catError_1, sanityProduct, sanityError_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, axios_1.default.get('https://makeup-api.herokuapp.com/api/v1/products.json')];
                case 1:
                    response = _a.sent();
                    products = response.data;
                    console.log("Raw API Data:", products);
                    if (!Array.isArray(products)) {
                        console.error("API data is not an array. Check API response format.");
                        return [2 /*return*/];
                    }
                    counter = 1;
                    _i = 0, products_1 = products;
                    _a.label = 2;
                case 2:
                    if (!(_i < products_1.length)) return [3 /*break*/, 15];
                    product = products_1[_i];
                    console.log("Processing product:", product);
                    if (!product || !product.name) {
                        console.error("Product or name is missing:", product);
                        return [3 /*break*/, 14];
                    }
                    if (!product.category || !product.category.name) {
                        console.error("Category or category name is missing:", product);
                        product.category = { name: "Uncategorized" }; // Or skip with 'continue'
                    }
                    imageRef = null;
                    catRef = null;
                    if (!product.image) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, uploadImageToSanity(product.image)];
                case 4:
                    imageRef = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    imageError_1 = _a.sent();
                    console.error("Error uploading image for product", product.name, imageError_1);
                    return [3 /*break*/, 6];
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, createCategory(product.category, counter)];
                case 7:
                    catRef = _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    catError_1 = _a.sent();
                    console.error("Error creating category for product", product.name, catError_1);
                    return [3 /*break*/, 9];
                case 9:
                    sanityProduct = {
                        _id: "product-".concat(counter),
                        _type: 'product',
                        name: product.name,
                        slug: {
                            _type: 'slug',
                            current: (0, slugify_1.default)(product.name, { lower: true, strict: true }),
                        },
                        price: product.price,
                        category: catRef ? { _type: 'reference', _ref: catRef } : undefined,
                        tags: product.tags || [],
                        quantity: 50,
                        image: imageRef ? { _type: 'image', asset: { _type: 'reference', _ref: imageRef } } : undefined,
                        description: product.description || "A timeless design...",
                        features: product.features || ["Premium material..."],
                        dimensions: product.dimensions || { _type: 'dimensions', height: "110cm", width: "75cm", depth: "50cm" },
                    };
                    console.log('Uploading product:', sanityProduct);
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, sanityClient_js_1.client.createOrReplace(sanityProduct)];
                case 11:
                    _a.sent();
                    console.log("\u2705 Imported product: ".concat(sanityProduct.name));
                    return [3 /*break*/, 13];
                case 12:
                    sanityError_1 = _a.sent();
                    console.error("Error creating/replacing Sanity product:", sanityProduct, sanityError_1);
                    return [3 /*break*/, 13];
                case 13:
                    counter++;
                    _a.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 2];
                case 15:
                    console.log('✅ Data import completed!');
                    return [3 /*break*/, 17];
                case 16:
                    error_3 = _a.sent();
                    console.error('❌ Error importing data:', error_3);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
importData();
