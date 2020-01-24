export class mqttDoorOpenReq {
    public SoureceReader: String = '';
    public RequestId: String = '';
}

export class mqttDoorOpenCmd {
    public SoureceReader: String = '';
    public RequestId: String = '';
}

export class ServerStatus {
    public IpAddress: Array<String> = [];
    public Status: String = '';
}
