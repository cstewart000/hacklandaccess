import mongoose from '../mongo';

export interface IUser extends mongoose.Document {
    name: string;
    userId: string;
    rfidToken: [string];
    admin: boolean;
    email: string;
    enabled: boolean;
    slackUserId: string;
    accessChannels: [string];
}

export const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: false },
    rfidToken: { type: [String], required: false },
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

    public async setAccessChannels(accessChannels: Array<string>): Promise<void> {
        this.accessChannels = accessChannels;
        return await this.save();
    }

    public async setSlackUserId(slackUserId: string): Promise<void> {
        this.slackUserId = slackUserId;
        return await this.save();
    }

    public async addRfidToken(rfidToken: string): Promise<void> {
        if (this.rfidToken.includes(rfidToken)) {
            return;
        }
        this.rfidToken.push(rfidToken);
        return await this.save();
    }

    //
    // Static functions that work on the whole User Data model - these could be moved to a UserManager class
    //

    public static async findByUserId(userId: string): Promise<UserModel> {
        return await this.findOne({ userId });
    }

    public static async findByName(name: string): Promise<UserModel> {
        return await this.findOne({ name });
    }

    public static async findByRfidToken(rfidToken: string): Promise<UserModel> {
        return await this.findOne({ rfidToken });
    }

    public static async getAll(): Promise<UserModel[]> {
        return await this.find({});
    }

    public static async findUserByEmail(email: string): Promise<UserModel> {
        return await this.findOne({ email });
    }

    public static async setActiveChannelMembers(channel: string, memberList: Array<string>): Promise<void> {
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
