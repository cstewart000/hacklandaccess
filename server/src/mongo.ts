import mongoose from 'mongoose';
import Config from './configuration';

async function mongoConnect() {
    const connectionURI = `${Config.mongoConnectString}/${Config.mongoApplicationString}`;
    console.log(`mongoConnect: connecting to ${connectionURI}`);

    await mongoose
        .connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log(`mongoConnect: Connected`);
        })
        .catch(e => console.error(`mongoConnect: Error connecting to MongoDB: ${e.message}`));
}

mongoConnect();

export default mongoose;
