interface CallbackFunc {
    name: string;
    callback(data: object): Promise<void>;
}

export interface Message {
    Path: string;
	Data: string;
}

export interface Config {
    PlayerCount: number;
    DoubleRate: number;
	Rule: number;
	BotName: string[];
    BotStyle: number[][];
    Dealer: string;
    Debug: number[];

	GameType: number;
}

interface CardSet {
    Code: number;
	Type: number;
	Level: number;
	Value: number;
}

interface Point {
    Describe: string;
	Point: number;
}

export interface Result {
    Cards: number;
    WinScores: number;
    PointList: Point[];
    IsAllPay: boolean;
}

interface Log {
	PlayersCard: number[];
	Index: number;
	ActionCard: CardSet;
    Refer: ReferData;
}

interface ReferData {
	Style: number[];
	Reference: number;
	ReferStyle: number[];
}

export interface State {
	Config: Config;
	PlayersCard: number[];
	PlayingIndex: number;
    LastIndex: number;
    PlayHints: CardSet[][];
	PerviousCard: number[];
	IsFirstResult: boolean;
	PlayersResult: Result[];
	History: Log[];
    StartType: number[][];
    CardScore: number[];
    Threshold: number[];
    ReferCurrent: ReferData;
}

export interface Action {
    Index: number;
	Card: number;
}

export interface TestConfig {
    Config: Config;
	Count: number;
}

export interface RecordData {
    Key: number;
	Comment: string;
}

export interface NameLists {
    BotNameList: string[];
	DealerNameList: string[];
}

export interface RankInfo {
    Name: string;
	ScoreList: number[];
    total: number;
    win: number;
}

export interface FeatureInfo {
	NickName: string;
	Time: number;
	Card: number;
	GameType: number;
	CardEvaluate: number;
	GameEvaluate: number;
    Win: number;
	TurnAvgCardRate: number;
	TurnMaxOrderDiff: number;
	TurnMaxRateDiff: number;
	ReverseRate: number;

    Index: number;
}

export interface ReplayData {
    Config: Config;
	History: Log[];
    PlayersResult: Result[];
}

export class Client {

    // Client private variable
    static ws: WebSocket;
    static uri: string = "ws://localhost";
    static callbackList: CallbackFunc[] = [];
    static messageList: Message[] = [];

    // Client public variable
    static IsOpen: boolean = false;
    static OnConnect(): void{};
    static OnDisconnect(): void{};

    public static SetCallback(name: string, callback: any) {
        for (let i = 0; i < Client.callbackList.length; i++) {
            if (Client.callbackList[i].name == name) {
                Client.callbackList[i].callback = callback;
                return
            }
        }
        Client.callbackList.push({name, callback});
    }

    public static Connect(uri: string) {
        Client.uri = "ws://" + uri;
        Client.ws = new WebSocket(Client.uri);
        Client.ws.onopen = async function() {
            Client.IsOpen = true;
            Client.messageList = [];
            Client.OnConnect();
            console.log("connected to " + Client.uri);
            while (Client.IsOpen) {
                if (Client.messageList.length > 0) {
                    let message = Client.messageList[0];
                    Client.messageList.shift();
                    for (let i = 0; i < Client.callbackList.length; i++) {
                        if (Client.callbackList[i].name == message.Path) {
                            await Client.callbackList[i].callback(message);
                        }
                    }
                } else {
                    await sleep(10);
                }
            }
        }
        Client.ws.onclose = function(event) {
            Client.IsOpen = false;
            Client.messageList = [];
            Client.OnDisconnect();
            console.log("connection closed (" + event.code + ")");
        }
        Client.ws.onmessage = async function(event) {
            let data = JSON.parse(event.data);
            //console.log(data);
            Client.messageList.push(data);
        }
    }

    public static Close() {
        Client.ws.close();
    }

    public static SendMessage(path: string, data: any) {
        if (Client.IsOpen) {
            Client.ws.send(JSON.stringify({ Path: path, Data: JSON.stringify(data) }));
        }
    }

}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
