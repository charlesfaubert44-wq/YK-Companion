"use strict";
/**
 * YK Companion Shared Utilities
 * Core utilities and helpers shared across web, mobile, and API apps
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithRetry = exports.withRetry = exports.retryWithBackoff = exports.asyncBatch = exports.asyncAllSettled = exports.asyncCache = exports.pollUntil = exports.sleep = exports.throttleAsync = exports.debounceAsync = exports.withTimeout = exports.asyncSequential = exports.asyncPool = exports.safeAsync = void 0;
exports.getCurrentSeason = getCurrentSeason;
exports.formatCurrency = formatCurrency;
exports.daysBetween = daysBetween;
exports.isAuroraFavorable = isAuroraFavorable;
exports.getAuroraQuality = getAuroraQuality;
exports.estimateTripCost = estimateTripCost;
exports.isValidEmail = isValidEmail;
exports.slugify = slugify;
exports.getDistance = getDistance;
// Define Season enum locally (was imported from types package)
var Season;
(function (Season) {
    Season["WINTER"] = "winter";
    Season["SPRING"] = "spring";
    Season["SUMMER"] = "summer";
    Season["FALL"] = "fall";
})(Season || (Season = {}));
// ============================================================
// EXPORTS - New Utility Modules
// ============================================================
// Async and Promise utilities (excluding retryWithBackoff to avoid conflict)
var async_1 = require("./async");
Object.defineProperty(exports, "safeAsync", { enumerable: true, get: function () { return async_1.safeAsync; } });
Object.defineProperty(exports, "asyncPool", { enumerable: true, get: function () { return async_1.asyncPool; } });
Object.defineProperty(exports, "asyncSequential", { enumerable: true, get: function () { return async_1.asyncSequential; } });
Object.defineProperty(exports, "withTimeout", { enumerable: true, get: function () { return async_1.withTimeout; } });
Object.defineProperty(exports, "debounceAsync", { enumerable: true, get: function () { return async_1.debounceAsync; } });
Object.defineProperty(exports, "throttleAsync", { enumerable: true, get: function () { return async_1.throttleAsync; } });
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return async_1.sleep; } });
Object.defineProperty(exports, "pollUntil", { enumerable: true, get: function () { return async_1.pollUntil; } });
Object.defineProperty(exports, "asyncCache", { enumerable: true, get: function () { return async_1.asyncCache; } });
Object.defineProperty(exports, "asyncAllSettled", { enumerable: true, get: function () { return async_1.asyncAllSettled; } });
Object.defineProperty(exports, "asyncBatch", { enumerable: true, get: function () { return async_1.asyncBatch; } });
// Form validation and management utilities
__exportStar(require("./forms"), exports);
// Query parameter and URL utilities
__exportStar(require("./query-params"), exports);
// Date and time utilities (Yellowknife-specific)
__exportStar(require("./datetime"), exports);
// API retry logic with exponential backoff (Architecture: Reliability Strategy)
// This is the improved version, replacing the one from async.ts
var retry_1 = require("./retry");
Object.defineProperty(exports, "retryWithBackoff", { enumerable: true, get: function () { return retry_1.retryWithBackoff; } });
Object.defineProperty(exports, "withRetry", { enumerable: true, get: function () { return retry_1.withRetry; } });
Object.defineProperty(exports, "fetchWithRetry", { enumerable: true, get: function () { return retry_1.fetchWithRetry; } });
// Input validation with Zod schemas (Architecture: Security Strategy)
// Note: Exports ZodValidationResult (renamed to avoid conflict with forms ValidationResult)
__exportStar(require("./validation"), exports);
// ============================================================
// LEGACY UTILITIES (backward compatibility)
// Keeping these for existing code that imports them
// ============================================================
/**
 * Get the current season based on the date
 */
function getCurrentSeason(date = new Date()) {
    const month = date.getMonth();
    if (month >= 11 || month <= 2) {
        return Season.WINTER;
    }
    else if (month >= 3 && month <= 4) {
        return Season.SPRING;
    }
    else if (month >= 5 && month <= 7) {
        return Season.SUMMER;
    }
    else {
        return Season.FALL;
    }
}
/**
 * Format currency in CAD
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(amount);
}
/**
 * Calculate the number of days between two dates
 */
function daysBetween(start, end) {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
/**
 * Check if aurora viewing is favorable based on KP index
 */
function isAuroraFavorable(kpIndex, cloudCover) {
    return kpIndex >= 3 && cloudCover < 50;
}
/**
 * Get aurora quality rating
 */
function getAuroraQuality(kpIndex) {
    if (kpIndex >= 7)
        return 'excellent';
    if (kpIndex >= 5)
        return 'good';
    if (kpIndex >= 3)
        return 'fair';
    return 'poor';
}
function estimateTripCost(numberOfDays, accommodationPerNight, activityCosts, numberOfPeople = 1) {
    const accommodation = numberOfDays * accommodationPerNight * numberOfPeople;
    const activities = activityCosts.reduce((sum, cost) => sum + cost, 0) * numberOfPeople;
    const food = numberOfDays * 75 * numberOfPeople; // Estimate $75/day per person for food
    const transportation = 50 * numberOfPeople; // Estimate for local transportation
    return {
        accommodation,
        activities,
        food,
        transportation,
        total: accommodation + activities + food + transportation,
    };
}
/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Generate a slug from a string
 */
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}
/**
 * Get distance between two coordinates (Haversine formula)
 */
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
//# sourceMappingURL=index.js.map