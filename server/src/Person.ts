import mongoose from './mongo';
import * as assert from 'assert';

const schema = new mongoose.Schema<IPerson>({ firstName: String, lastName: String });

export interface IPerson extends mongoose.Document {
    firstName: string;
    lastName: string;
    fullName: string;
}

class PersonClass extends mongoose.Model {
    firstName!: string;
    lastName!: string;

    // `fullName` becomes a virtual
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    set fullName(v) {
        const firstSpace = v.indexOf(' ');
        this.firstName = v.split(' ')[0];
        this.lastName = firstSpace === -1 ? '' : v.substr(firstSpace + 1);
    }

    // `getFullName()` becomes a document method
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    // `findByFullName()` becomes a static
    static async findByFullName(name: string) {
        const firstSpace = name.indexOf(' ');
        const firstName = name.split(' ')[0];
        const lastName = firstSpace === -1 ? '' : name.substr(firstSpace + 1);
        console.log({ firstName, lastName });
        return await this.findOne({ firstName, lastName }).catch(err => console.log(err));
    }
}

schema.loadClass(PersonClass);
const Person = mongoose.model<IPerson>('Person', schema);

export default Person;
