const {ccclass, property} = cc._decorator;

export interface LineChartData {
    Name: string;
	Color: cc.Color;
	Value: cc.Vec2[];
}

export interface BarChartData {
    Name: string;
    Color: cc.Color;
	Value: number[];
}

export interface BarChartColumn {
    Name: string;
	Value: number;
}

@ccclass
export class Visualizer extends cc.Mask {

    @property(cc.Graphics)
    graphics: cc.Graphics;

    @property(Boolean)
    drawBorder: Boolean = false;

    onLoad() {
        this.Clear();
    }

    Clear() {
        this.graphics.node.destroyAllChildren();
        this.graphics.node.removeAllChildren();
        this.graphics.clear();
        // border
        if (this.drawBorder) {
            const borderWidth = 5;
            const borderColor = cc.Color.BLACK;
            this.graphics.lineWidth = borderWidth;
            this.graphics.strokeColor = borderColor;
            this.graphics.rect(0, 0, this.node.width, this.node.height);
            this.graphics.stroke();
        }
    }

    DrawLineChart(nameX: string, nameY: string, rangeX: number, rangeY: number, data: LineChartData[]) {
        const axisX = this.node.width * 0.2, offsetX = this.node.width * 0.3, offsetY = this.node.height * 0.1, rangeWidth = this.node.width * 0.65, rangeHeight = this.node.height * 0.85;
        // draw axis
        const axisWidth = 10;
        const axisColor = cc.Color.BLACK;
        this.graphics.lineWidth = axisWidth;
        this.graphics.strokeColor = axisColor;
        this.graphics.moveTo(axisX, offsetY);
        this.graphics.lineTo(this.node.width, offsetY);
        this.graphics.moveTo(offsetX, 0);
        this.graphics.lineTo(offsetX, this.node.height);
        this.graphics.stroke();
        // draw scale
        const scaleCount = 5;
        const scaleWidth = 5;
        const scaleColor = cc.Color.BLACK;
        this.graphics.lineWidth = scaleWidth;
        this.graphics.strokeColor = scaleColor;
        for (let i = 1; i <= scaleCount; i++) {
            this.graphics.moveTo(offsetX, offsetY + i / scaleCount * rangeHeight);
            this.graphics.lineTo(this.node.width, offsetY + i / scaleCount * rangeHeight);
            this.graphics.moveTo(offsetX + i / scaleCount * rangeWidth, offsetY);
            this.graphics.lineTo(offsetX + i / scaleCount * rangeWidth, this.node.height);
        }
        this.graphics.stroke();
        // draw data
        const dataWidth = 4;
        for (let i = 0; i < data.length; i++) {
            if (data[i].Value.length <= 0) {
                continue;
            }
            data[i].Value.sort((a: cc.Vec2, b:cc.Vec2): number => {
                return a.x - b.x;
            });
            this.graphics.lineWidth = dataWidth;
            this.graphics.strokeColor = data[i].Color;
            this.graphics.moveTo(offsetX + data[i].Value[0].x / rangeX * rangeWidth, offsetY + data[i].Value[0].y / rangeY * rangeHeight);
            for (let j = 1; j < data[i].Value.length; j++) {
                this.graphics.lineTo(offsetX + data[i].Value[j].x / rangeX * rangeWidth, offsetY + data[i].Value[j].y / rangeY * rangeHeight);
            }
            this.graphics.stroke();
        }
        // axis text
        const axisTextColor = cc.Color.BLACK;
        const axisTextSize = offsetY * 0.3;
        const axisTextBorder = offsetY * 0.1;
        let axisXLabelNode = new cc.Node("axisXLabel")
        let axisXLabel = axisXLabelNode.addComponent(cc.Label);
        axisXLabelNode.setPosition(offsetX + axisTextBorder, offsetY - axisTextBorder);
        axisXLabelNode.setAnchorPoint(0, 1);
        axisXLabelNode.color = axisTextColor;
        axisXLabelNode.parent = this.graphics.node;
        axisXLabel.string = nameX;
        axisXLabel.fontSize = axisTextSize;
        axisXLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        axisXLabel.verticalAlign = cc.Label.VerticalAlign.TOP;
        axisXLabel.enableWrapText = false;
        let axisYLabelNode = new cc.Node("axisYLabel")
        let axisYLabel = axisYLabelNode.addComponent(cc.Label);
        axisYLabelNode.setPosition(offsetX - axisTextBorder, offsetY + axisTextBorder);
        axisYLabelNode.setAnchorPoint(1, 0);
        axisYLabelNode.color = axisTextColor;
        axisYLabelNode.parent = this.graphics.node;
        axisYLabel.string = nameY;
        axisYLabel.fontSize = axisTextSize;
        axisYLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
        axisYLabel.verticalAlign = cc.Label.VerticalAlign.BOTTOM;
        axisYLabel.enableWrapText = false;
        // scale text
        const scaleTextColor = cc.Color.BLACK;
        const scaleTextSize = offsetY * 0.5;
        const scaleTextBorder = offsetY * 0.1;
        for (let i = 1; i <= scaleCount; i++) {
            let scaleXLabelNode = new cc.Node("scaleXLabel")
            let scaleXLabel = scaleXLabelNode.addComponent(cc.Label);
            scaleXLabelNode.setPosition(offsetX + i / scaleCount * rangeWidth, offsetY - scaleTextBorder);
            scaleXLabelNode.setAnchorPoint(0.5, 1);
            scaleXLabelNode.color = scaleTextColor;
            scaleXLabelNode.parent = this.graphics.node;
            scaleXLabel.string = (Math.round(i / scaleCount * rangeX * 100) / 100).toString();
            scaleXLabel.fontSize = scaleTextSize;
            scaleXLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            scaleXLabel.verticalAlign = cc.Label.VerticalAlign.TOP;
            scaleXLabel.enableWrapText = false;
            let scaleYLabelNode = new cc.Node("scaleYLabel")
            let scaleYLabel = scaleYLabelNode.addComponent(cc.Label);
            scaleYLabelNode.setPosition(offsetX - scaleTextBorder, offsetY + i / scaleCount * rangeHeight);
            scaleYLabelNode.setAnchorPoint(1, 0.5);
            scaleYLabelNode.color = scaleTextColor;
            scaleYLabelNode.parent = this.graphics.node;
            scaleYLabel.string = (Math.round(i / scaleCount * rangeY * 100) / 100).toString();
            scaleYLabel.fontSize = scaleTextSize;
            scaleYLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
            scaleYLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            scaleYLabel.enableWrapText = false;
        }
        // data text
        const dataY = this.node.height * 0.95;
        const dataGap = this.node.height * 0.1;
        const circleRadius = this.node.height * 0.02;
        const circleX = this.node.width * 0.03;
        const dataTextX = this.node.width * 0.06;
        const dataTextColor = cc.Color.BLACK;
        const dataTextSize = this.node.height * 0.05;
        for (let i = 0; i < data.length; i++) {
            if (data[i].Value.length <= 0) {
                continue;
            }
            this.graphics.lineWidth = 1;
            this.graphics.fillColor = data[i].Color;
            this.graphics.circle(circleX, dataY - i * dataGap, circleRadius);
            this.graphics.fill();
            let dataLabelNode = new cc.Node("dataLabel")
            let dataLabel = dataLabelNode.addComponent(cc.Label);
            dataLabelNode.setPosition(dataTextX, dataY - i * dataGap);
            dataLabelNode.setAnchorPoint(0, 0.5);
            dataLabelNode.color = dataTextColor;
            dataLabelNode.parent = this.graphics.node;
            dataLabel.string = data[i].Name;
            dataLabel.fontSize = dataTextSize;
            dataLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
            dataLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            dataLabel.enableWrapText = false;
        }
    }

    DrawBarChart(name: string, range: number, data: BarChartData[], column: BarChartColumn[]) {
        const offsetX = this.node.width * 0.15, offsetY = this.node.height * 0.1, rangeWidth = this.node.width * 0.85, rangeHeight = this.node.height * 0.85;
        // draw scale
        const scaleCount = 10;
        const scaleWidth = 5;
        const scaleColor = new cc.Color(100, 100, 100);
        this.graphics.lineWidth = scaleWidth;
        this.graphics.strokeColor = scaleColor;
        for (let i = 1; i <= scaleCount; i++) {
            this.graphics.moveTo(offsetX, offsetY + i / scaleCount * rangeHeight);
            this.graphics.lineTo(this.node.width, offsetY + i / scaleCount * rangeHeight);
        }
        this.graphics.stroke();
        // draw data
        const dataGap = 4;
        let dataWidth = 600 / (data.length * column.length);
        if (dataWidth > 75) {
            dataWidth = 75;
        }
        for (let i = 0; i < data.length; i++) {
            const dataOffset = i * (dataWidth + dataGap) - (data.length - 1) * (dataWidth + dataGap) / 2;
            this.graphics.lineWidth = dataWidth;
            this.graphics.strokeColor = data[i].Color;
            for (let j = 0; j < column.length; j++) {
                if (j == data[i].Value.length) {
                    break;
                }
                this.graphics.moveTo(offsetX + (j + 1) * rangeWidth / (column.length + 1) + dataOffset, offsetY);
                this.graphics.lineTo(offsetX + (j + 1) * rangeWidth / (column.length + 1) + dataOffset, offsetY + data[i].Value[j] / range * rangeHeight);
            }
            this.graphics.stroke();
        }
        // axis text
        const axisTextColor = new cc.Color(225, 225, 225);
        const axisTextSize = offsetY * 0.4;
        const axisTextBorder = offsetY * 0.1;
        let axisLabelNode = new cc.Node("axisLabel")
        let axisLabel = axisLabelNode.addComponent(cc.Label);
        axisLabelNode.setPosition(offsetX - axisTextBorder, offsetY + axisTextBorder);
        axisLabelNode.setAnchorPoint(1, 0);
        axisLabelNode.color = axisTextColor;
        axisLabelNode.parent = this.graphics.node;
        axisLabel.string = name;
        axisLabel.fontSize = axisTextSize;
        axisLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
        axisLabel.verticalAlign = cc.Label.VerticalAlign.BOTTOM;
        axisLabel.enableWrapText = false;
        // scale text
        const scaleTextColor = new cc.Color(225, 225, 225);
        const scaleTextSize = offsetY * 0.4;
        const scaleTextBorder = offsetY * 0.1;
        for (let i = 0; i < column.length; i++) {
            let scaleXLabelNode = new cc.Node("scaleXLabel");
            let scaleXLabel = scaleXLabelNode.addComponent(cc.Label);
            scaleXLabelNode.setPosition(offsetX + (i + 1) * rangeWidth / (column.length + 1), offsetY - scaleTextBorder);
            scaleXLabelNode.setAnchorPoint(0.5, 1);
            scaleXLabelNode.color = scaleTextColor;
            scaleXLabelNode.parent = this.graphics.node;
            scaleXLabel.string = column[i].Name;
            scaleXLabel.fontSize = scaleTextSize;
            scaleXLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            scaleXLabel.verticalAlign = cc.Label.VerticalAlign.TOP;
            scaleXLabel.enableWrapText = false;
        }
        for (let i = 1; i <= scaleCount; i++) {
            let scaleYLabelNode = new cc.Node("axisYLabel");
            let scaleYLabel = scaleYLabelNode.addComponent(cc.Label);
            scaleYLabelNode.setPosition(offsetX - scaleTextBorder, offsetY + i / scaleCount * rangeHeight);
            scaleYLabelNode.setAnchorPoint(1, 0.5);
            scaleYLabelNode.color = scaleTextColor;
            scaleYLabelNode.parent = this.graphics.node;
            scaleYLabel.string = (Math.round(i / scaleCount * range * 100) / 100).toString();
            scaleYLabel.fontSize = scaleTextSize;
            scaleYLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
            scaleYLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            scaleYLabel.enableWrapText = false;
        }
        // data text
        const dataTextColor = new cc.Color(225, 225, 225);
        const dataTextSize = this.node.height * 0.05;
        for (let i = 0; i < column.length; i++) {
            let dataLabelNode = new cc.Node("dataLabel")
            let dataLabel = dataLabelNode.addComponent(cc.Label);
            let Y = offsetY + rangeHeight - dataTextSize;
            dataLabelNode.setPosition(offsetX + (i + 1) * rangeWidth / (column.length + 1), Y);
            dataLabelNode.setAnchorPoint(0.5, 0);
            dataLabelNode.color = dataTextColor;
            dataLabelNode.parent = this.graphics.node;
            dataLabel.string = column[i].Value.toString();
            dataLabel.fontSize = dataTextSize;
            dataLabel.lineHeight = dataTextSize;
            dataLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            dataLabel.verticalAlign = cc.Label.VerticalAlign.BOTTOM;
            dataLabel.enableWrapText = false;
        }
        // draw axis
        const axisWidth = 10;
        const axisColor = new cc.Color(100, 100, 100);
        this.graphics.lineWidth = axisWidth;
        this.graphics.strokeColor = axisColor;
        this.graphics.moveTo(0, offsetY);
        this.graphics.lineTo(this.node.width, offsetY);
        //this.graphics.moveTo(offsetX, 0);
        //this.graphics.lineTo(offsetX, this.node.height);
        this.graphics.stroke();
        // side text
        const sideY = this.node.height * 0.95;
        const sideGap = this.node.height * 0.07;
        const circleRadius = this.node.height * 0.015;
        const circleX = this.node.width * 0.015;
        const sideTextX = this.node.width * 0.03;
        const sideTextColor = new cc.Color(225, 225, 225);
        const sideTextSize = this.node.height * 0.04;
        for (let i = 0; i < data.length; i++) {
            this.graphics.lineWidth = 1;
            this.graphics.fillColor = data[i].Color;
            this.graphics.circle(circleX, sideY - i * sideGap, circleRadius);
            this.graphics.fill();
            let dataLabelNode = new cc.Node("dataLabel")
            let dataLabel = dataLabelNode.addComponent(cc.Label);
            dataLabelNode.setPosition(sideTextX, sideY - i * sideGap);
            dataLabelNode.setAnchorPoint(0, 0.5);
            dataLabelNode.color = sideTextColor;
            dataLabelNode.parent = this.graphics.node;
            dataLabel.string = data[i].Name;
            dataLabel.fontSize = sideTextSize;
            dataLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
            dataLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
            dataLabel.enableWrapText = false;
        }
    }

}

