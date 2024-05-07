"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const _1 = require(".");
describe('Hello world', () => {
    it('should display hello world message', async () => {
        const response = await (0, supertest_1.default)(_1.app).get('/').send();
        expect(response.statusCode).toBe(200);
    });
});
