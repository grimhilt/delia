export class Anecdote {

    constructor(anecdote) {
        this.id = anecdote.id ?? undefined;
        this.header = anecdote.header;
        this.title = anecdote.title;
        this.body = anecdote.body;
    }
};