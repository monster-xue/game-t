// assets/scripts/ui/FillRateBar.ts

import { _decorator, Component, Node, Sprite, UITransform, Label, Color } from 'cc';
import { GAME_CONFIG } from '../core/GameConstants';

const { ccclass, property } = _decorator;

@ccclass('FillRateBar')
export class FillRateBar extends Component {
    @property(Sprite)
    barSprite: Sprite = null;

    @property(Label)
    textLabel: Label = null;

    @property(Node)
    backgroundNode: Node = null;

    private _currentFillRate: number = 0;

    public updateFillRate(fillRate: number): void {
        this._currentFillRate = fillRate;
        this.updateBar(fillRate);
        this.updateColor(fillRate);
        this.updateText(fillRate);
    }

    private updateBar(fillRate: number): void {
        if (!this.barSprite) return;

        const barTransform = this.barSprite.node.getComponent(UITransform);
        if (!barTransform) return;

        // 获取背景宽度
        let maxWidth = 500; // 默认值
        if (this.backgroundNode) {
            const bgTransform = this.backgroundNode.getComponent(UITransform);
            if (bgTransform) {
                maxWidth = bgTransform.width;
            }
        }

        const currentWidth = maxWidth * fillRate;
        barTransform.setContentSize(currentWidth, barTransform.height);
    }

    private updateColor(fillRate: number): void {
        if (!this.barSprite) return;

        let barColor: Color;

        if (fillRate >= 0.95) {
            barColor = new Color(255, 0, 0); // 红色警告
        } else if (fillRate >= 0.8) {
            barColor = new Color(255, 200, 0); // 黄色
        } else {
            barColor = new Color(100, 200, 100); // 绿色
        }

        this.barSprite.color = barColor;
    }

    private updateText(fillRate: number): void {
        if (!this.textLabel) return;

        const percentage = (fillRate * 100).toFixed(1);
        this.textLabel.string = `${percentage}%`;
    }

    public get fillRate(): number {
        return this._currentFillRate;
    }
}
