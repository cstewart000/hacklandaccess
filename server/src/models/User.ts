import mongoose from '../mongo';

export interface IUser extends mongoose.Document {
    name: string;
    userId: string;
    rfidToken: string;
    admin: boolean;
    email: string;
    enabled: boolean;
    slackUserId: string;
    accessChannels: [string];
}

export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: false },
    rfidToken: { type: String, required: false },
    admin: { type: String, default: false },
    email: { type: String, required: false },
    enabled: { type: Boolean, required: false },
    slackUserId: { type: String, required: false },
    accessChannels: { type: [String], required: false }
});

class UserModel extends mongoose.Model {
    public async isAuthenticated(): Promise<boolean> {
        return await this.accessChannels.includes['supporters'];
    }

    public async setAccessChannels(accessChannels: Array<String>): Promise<void> {
        this.accessChannels = accessChannels;
        return await this.save();
    }

    public async setSlackUserId(slackUserId: String): Promise<void> {
        this.slackUserId = slackUserId;
        return await this.save();
    }

    //
    // Static functions that work on the whole User Data model - these could be moved to a UserManager class
    //

    public static async findByUserId(userId: string): Promise<UserModel> {
        console.log('findByUserId');
        return await this.findOne({ userId });
    }

    public static async findByName(name: string): Promise<UserModel> {
        console.log('findByName');
        return await this.findOne({ name });
    }

    public static async findByRfidToken(rfidToken: string): Promise<UserModel> {
        console.log('findByrfidToken');
        return await this.findOne({ rfidToken });
    }

    public static async getAll(): Promise<UserModel[]> {
        console.log('getAll');
        return await this.find({});
    }

    public static async findUserByEmail(email: String): Promise<UserModel> {
        console.log('findUserByEmail');
        return await this.findOne({ email });
    }

    public static async setActiveChannelMembers(channel: String, memberList: Array<String>): Promise<void> {
        const userList = await this.getAll();
        userList.forEach(async user => {
            if (memberList.includes(user.slackUserId)) {
                await user.setAccessChannels([channel]);
            } else {
                await user.setAccessChannels([]);
            }
        });
    }
}

userSchema.loadClass(UserModel);
const User = <any>mongoose.model<IUser>('User', userSchema);
export default User;
