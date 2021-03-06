const {ccclass, property} = cc._decorator;

@ccclass
export default class DropDown extends cc.Component {

    @property(cc.Button)
    selector: cc.Button;

    @property(cc.Node)
    select: cc.Node;

    @property(cc.Node)
    backGroundNode: cc.Node;

    @property(cc.Node)
    scrollNode: cc.Node;

    @property(cc.Node)
    viewNode: cc.Node;

    @property(cc.Node)
    contentNode: cc.Node;

    @property(cc.Node)
    barNode: cc.Node;

    list: string[];

    onLoad () {
        this.selector.node.on('click', () => { this.onSelect(); });
    }

    onSelect () {
        this.scrollNode.active = this.backGroundNode.scaleY > 0;
        this.backGroundNode.scaleY *= -1;
    }

    SetNames (botList: string[]) {
        this.list = botList;
        const MAX_ITEM = 7;
        this.contentNode.destroyAllChildren();
        this.contentNode.removeAllChildren();
        const Height = this.node.height;
        this.scrollNode.setPosition(0, -Height / 2);
        this.scrollNode.width = this.node.width;
        this.scrollNode.height = botList.length * Height;
        this.viewNode.width = this.node.width;
        this.viewNode.height = botList.length * Height;
        this.contentNode.width = this.node.width;
        this.contentNode.height = botList.length * Height;
        if (botList.length > MAX_ITEM) {
            this.scrollNode.height = MAX_ITEM * Height;
            this.viewNode.height = MAX_ITEM * Height;
        }
        this.select.setContentSize(this.node.getContentSize());
        this.select.getComponent(cc.Label).lineHeight = Height;
        this.select.getComponent(cc.Label).fontSize = Height * 0.8;
        if (botList.length <= 0) {
            this.barNode.height = 0;
            this.select.getComponent(cc.Label).string = "";
        } else {
            this.barNode.height = this.viewNode.height / this.contentNode.height * this.viewNode.height;
            if (this.select.getComponent(cc.Label).string == "") {
                this.select.getComponent(cc.Label).string = botList[0];
            }
        }
        for (let i = 0; i < botList.length; i++) {
            var bot = cc.instantiate(this.select);
            bot.setPosition(bot.x, i * -Height);
            bot.anchorY = 1;
            bot.getComponent(cc.Label).string = botList[i];
            bot.addComponent(cc.Button);
            bot.on('click', (target: cc.Node) => {
                let change = this.select.getComponent(cc.Label).string != target.getComponent(cc.Label).string;
                this.select.getComponent(cc.Label).string = target.getComponent(cc.Label).string;
                this.onSelect();
                if (change) {
                    this.OnChange();
                }
            });
            bot.parent = this.contentNode;
        }
    }

    SetCurrent(item: string) {
        this.select.getComponent(cc.Label).string = item;
    }

    GetCurrent(): string {
        return this.select.getComponent(cc.Label).string;
    }

    GetIndex(): number {
        return this.list.indexOf(this.select.getComponent(cc.Label).string);
    }

    OnChange() {

    }

}
