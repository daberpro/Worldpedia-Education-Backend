/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import mongoose, { Document } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID dari MongoDB
 *         fullName:
 *           type: string
 *           description: Nama lengkap pengguna
 *         username:
 *           type: string
 *           description: Username unik
 *         email:
 *           type: string
 *           format: email
 *           description: Email pengguna
 *         role:
 *           type: string
 *           enum: [student, admin]
 *           default: student
 *         isVerified:
 *           type: boolean
 *           description: Status verifikasi email
 *         avatar:
 *           type: string
 *           description: URL foto profil
 *       example:
 *         id: 1234567890
 *         fullName: John Doe
 *         username: johndoe
 *         email: john@example.com
 *         role: student
 *         isVerified: false
 *         avatar: https://example.com/avatar.jpg
 */
export interface IUser extends Document {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: "student" | "admin";
    avatar?: string;
    isVerified: boolean;
    isLocked: boolean;
    lockUntil?: Date | null;
    loginAttempts: number;
    lastLogin?: Date;
    lastLogout?: Date;
    activationCode?: string;
    activationExpire?: Date;
    resetToken?: string;
    resetExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
    isAccountLocked(): boolean;
    incLoginAttempts(): void;
    resetLoginAttempts(): void;
    toJSON(): object;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map