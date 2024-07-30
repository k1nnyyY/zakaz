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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountInfo = void 0;
const http_utils_1 = require("../utils/http-utils");
const getAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        console.log('Полученный userId:', userId);
        if (!userId ||
            typeof userId !== 'object' ||
            !userId.address ||
            !userId.chain ||
            !userId.walletStateInit ||
            !userId.publicKey) {
            return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Некорректные параметры userId' }));
        }
        const result = yield req.db.get('SELECT * FROM users2 WHERE user_id = ?', [userId.address]);
        if (result) {
            return res.status(200).json((0, http_utils_1.ok)(result));
        }
        else {
            return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Пользователь не найден' }));
        }
    }
    catch (error) {
        console.error('Ошибка получения информации об аккаунте:', error);
        if (error instanceof Error) {
            return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Некорректный запрос', trace: error.message }));
        }
        else {
            return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Некорректный запрос', trace: String(error) }));
        }
    }
});
exports.getAccountInfo = getAccountInfo;
