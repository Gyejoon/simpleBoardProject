import mongoose from 'mongoose';
import moment from 'moment';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Board = new Schema({
    writer: String,
    title: String,
    contents: String,
    comments: [{
        writer: String,
        contents: String,
        date: {
            created: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
            edited: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
        },
        pointer: String
    }],
    views: {type: Number, default: 0},
    date: {
        created: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
        edited: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
    }
});

Board.methods.generateHash = function(username) {
    return bcrypt.hashSync(username, 8);
};

export default mongoose.model('board', Board);
