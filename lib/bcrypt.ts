import bcrypt from "bcrypt";

export const hash = async (plainText: string, salt : number = 10): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt, function (err, salt) {
            bcrypt.hash(plainText, salt, function (err, hashText) {
                if (!err) {
                    return resolve(hashText);
                }
                reject(err);
            });
        });
    });
};

export const compare = async (plainText: string, hashText: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hashText, function (err, result) {
            if (!err) {
                return resolve(result);
            }
            reject(err);
        });
    });
};
