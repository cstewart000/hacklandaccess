export class mqttDoorOpenReq {
    public SoureceReader: string = '';
    public RequestId: string = '';
}

export class mqttDoorOpenCmd {
    public SoureceReader: string = '';
    public RequestId: string = '';
}

export class ServerStatus {
    public IpAddress: Array<string> = [];
    public Status: string = '';
}
