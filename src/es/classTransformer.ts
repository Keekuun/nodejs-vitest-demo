import {plainToInstance} from 'class-transformer';
import path from 'node:path';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

import usersJson from "./data/user.json" with { type: 'json' };

// 获取 ESM 模式下的正确路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 JSON 文件
const rawData = readFileSync(
    path.join(__dirname, 'data/user.json'), // 注意相对路径层级
    'utf-8'
);

// user json
/**
 [
 {
 "id": 1,
 "firstName": "Johny",
 "lastName": "Cage",
 "age": 27
 },
 {
 "id": 2,
 "firstName": "Ismoil",
 "lastName": "Somoni",
 "age": 50
 },
 {
 "id": 3,
 "firstName": "Luke",
 "lastName": "Dacascos",
 "age": 12
 }
 ]
 */

export class User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;

    constructor(id: number, firstName: string, lastName: string, age: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    getName() {
        return this.firstName + ' ' + this.lastName;
    }

    isAdult() {
        return this.age > 36 && this.age < 60;
    }
}

// const usersJson = JSON.parse(rawData);
// 将user.json数组转换为User数组
// before：
try {
    const users: User[] = JSON.parse(rawData);
    console.log(users[0]?.isAdult())
} catch (e) {
    // TypeError: users[0]?.isAdult is not a function
    console.log(e);
}

// now：
const realUsers = plainToInstance(User, usersJson);
console.log(realUsers[0].isAdult()); // false
