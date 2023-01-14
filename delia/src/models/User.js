export class User {

    // constructor(user) {
    //     this.id = user.id;
    //     this.username = user.username;
    //     this.token = user.token ?? undefined;
    // }

    constructor(id, username, token = undefined) {
        this.id = id;
        this.username = username;
        this.token = token;
    }

};