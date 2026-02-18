// assets/scripts/ui/FillRateBar.ts

import { _decorator, Component, Node, Sprite, UITransform, Label, Color } from 'cc';
import { GAME_CONFIG } from '../core/GameConstants';
import { TextureGenerator } from '../utils/TextureGenerator';

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

    onLoad() {
        // 初始化背景纹理
        if (this.backgroundNode) {
            const bgSprite = this.backgroundNode.getComponent(Sprite);
            if (bgSprite && !bgSprite.spriteFrame) {
                const bgColor = new Color();
                Color.fromHEX(bgColor, '#CCCCCC');
                bgSprite.spriteFrame = TextureGenerator.createSolidTexture(500, 30, bgColor);
            }
        }

        // 初始化进度条纹理
        if (this.barSprite && !this.barSprite.spriteFrame) {
            const barColor = new Color();
            Color.fromHEX(barColor, '#64C864');
            this.barSprite.spriteFrame = TextureGenerator.createSolidTexture(500, 30, barColor);
        }
    }

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
