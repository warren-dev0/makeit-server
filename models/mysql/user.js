import { connection } from "./connection.js";
import { userMapperToMySQL } from '../../mappers/to-mysql.js';
import { userMapperFromMySQL } from '../../mappers/from-mysql.js';
import bcrypt  from 'bcrypt';

export class UserModel {

    static async login({ input }) {
        const { name, password } = input;

        let [userNotMappered] = await connection.query(
            'SELECT BIN_TO_UUID(user_id) user_id, user_avatar, user_email, user_name, user_pass, user_1question, user_1answer, user_2question, user_2answer, user_3question, user_3answer, user_date_created FROM users WHERE user_name = ?;', [name]
        );

        if(userNotMappered.length === 0) {
            [userNotMappered] = await connection.query(
                'SELECT BIN_TO_UUID(user_id) user_id, user_avatar, user_email, user_name, user_pass, user_1question, user_1answer, user_2question, user_2answer, user_3question, user_3answer, user_date_created FROM users WHERE user_email = ?;', [name]
            );
        }

        if(userNotMappered.length === 0) return null;

        const user = userMapperFromMySQL(userNotMappered[0]);

        const isValidPassword = await bcrypt.compare(password, user.hashedpassword);

        if (!isValidPassword) return null;

        return {
            id: user.id,
            avatar: user.avatar,
            name: user.name
        };
    }

    static async getById({ userId }) {
        const [userNotMappered] = await connection.query(
            'SELECT BIN_TO_UUID(user_id) user_id, user_avatar, user_email, user_name, user_pass, user_1question, user_1answer, user_2question, user_2answer, user_3question, user_3answer, user_date_created FROM users WHERE BIN_TO_UUID(user_id) = ?;', [userId]
        );

        if(userNotMappered.length === 0) return null;

        const user = userMapperFromMySQL(userNotMappered[0]);

        return {
            id: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            dateCreated: user.dateCreated
        };
    };

    static async create({ input }) {
        const {
            avatar,
            email,
            name,
            password,
            firstQuestion,
            firstAnswer,
            secondQuestion,
            secondAnswer,
            thirdQuestion,
            thirdAnswer
        } = input;

        const [userName] = await connection.query(
            'SELECT user_name FROM users WHERE user_name = ?;', [name]
        );

        if (userName.length > 0) return null;

        const [uuidResult] = await connection.query('SELECT UUID() uuid;');
        const [{ uuid }] = uuidResult;

        let dateCreated = new Date().toString();
        const hashedpassword = await bcrypt.hash(password, 10);

        const hashedFirstAnswer = await bcrypt.hash(firstAnswer, 10);
        const hashedSecondAnswer = await bcrypt.hash(secondAnswer, 10);
        const hashedThirdAnswer = await bcrypt.hash(thirdAnswer, 10);

        const newUser = userMapperToMySQL({ avatar, email, name, hashedpassword, firstQuestion, hashedFirstAnswer, secondQuestion, hashedSecondAnswer, thirdQuestion, hashedThirdAnswer, dateCreated });

        Object.keys(newUser).forEach((key) => {
            if (newUser[key] === undefined || newUser[key] === null || newUser[key] === '') delete newUser[key];
        });
        
        newUser.user_avatar = `'${newUser.user_avatar}'`;
        newUser.user_email = `'${newUser.user_email}'`;
        newUser.user_name = `'${newUser.user_name}'`;
        newUser.user_pass = `'${newUser.user_pass}'`;
        newUser.user_1question = `'${newUser.user_1question}'`;
        newUser.user_1answer = `'${newUser.user_1answer}'`;
        newUser.user_2question = `'${newUser.user_2question}'`;
        newUser.user_2answer = `'${newUser.user_2answer}'`;
        newUser.user_3question = `'${newUser.user_3question}'`;
        newUser.user_3answer = `'${newUser.user_3answer}'`;
        newUser.user_date_created = `'${newUser.user_date_created}'`;


        const userKeys = Object.keys(newUser).join(', ');
        const userValues = Object.values(newUser).join(', ');

        try {
            await connection.query(
                `INSERT INTO users (user_id, ${userKeys}) VALUES ((UUID_TO_BIN('${uuid}')) ,${userValues});`

            );
        } catch (e) {
            throw new Error('Error creating user');
        }

        let [createdUser] = await connection.query(
            'SELECT BIN_TO_UUID(user_id) user_id, user_avatar, user_name FROM users WHERE BIN_TO_UUID(user_id) = ?;', [uuid]
        );

        createdUser = userMapperFromMySQL(createdUser[0]);

        Object.keys(createdUser).forEach((key) => {
            if (createdUser[key] === undefined || createdUser[key] === null || createdUser[key] === '') delete createdUser[key];
        });

        return createdUser;
    };

    static async update({ userId, input }) {
        const {
            avatar,
            password,
        } = input;

        
        const [user] = await connection.query(
            'SELECT * FROM users WHERE BIN_TO_UUID(user_id) = ?;', [userId]
        );
        
        if (user.length === 0) return null;
        
        const hashedpassword = await bcrypt.hash(password, 10);

        const valuesToUpdate = userMapperToMySQL({ avatar, hashedpassword });

        Object.keys(valuesToUpdate).forEach((key) => {
            if(valuesToUpdate[key] === undefined) delete valuesToUpdate[key];
        });

        const keys = Object.keys(valuesToUpdate);
        const values = Object.values(valuesToUpdate);

        const updateQuery = keys.map((key) => `${key} = ?`).join(', ');

        try {
            await connection.query(
                `UPDATE users SET ${updateQuery} WHERE BIN_TO_UUID(user_id) = ?;`,
                [...values, userId]
            );
        } catch (e) {
            throw new Error('Error updating user');
        }

        const [updatedUser] = await connection.query(
            'SELECT BIN_TO_UUID(user_id) user_id, user_avatar, user_name FROM users WHERE BIN_TO_UUID(user_id) = ?;', [userId]
        );

        return updatedUser[0];

    };

    static async delete({ userId }) {
        try {
            const [userDeleted] = await connection.query(
                'DELETE FROM users WHERE BIN_TO_UUID(user_id) = ?',
                [userId]
            );

            return userDeleted;
        } catch (e) {
            throw new Error('Error deleting user');
        }
    };
}