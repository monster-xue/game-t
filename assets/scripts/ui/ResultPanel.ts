// assets/scripts/ui/ResultPanel.ts

import { _decorator, Component, Node, Label, Button } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('ResultPanel')
export class ResultPanel extends Component {
    @property(Label)
    titleLabel: Label = null;

    @property(Label)
    fillRateLabel: Label = null;

    @property(Button)
    nextLevelButton: Button = null;

    @property(Button)
    retryButton: Button = null;

    @property(Button)
    shareButton: Button = null;

    private _fillRate: number = 0;

    onLoad() {
        this.node.active = false;

        if (this.nextLevelButton) {
            this.nextLevelButton.node.on(Button.EventType.CLICK, this.onNextLevel, this);
        }
        if (this.retryButton) {
            this.retryButton.node.on(Button.EventType.CLICK, this.onRetry, this);
        }
        if (this.shareButton) {
            this.shareButton.node.on(Button.EventType.CLICK, this.onShare, this);
        }
    }

    onDestroy() {
        if (this.nextLevelButton) {
            this.nextLevelButton.node.off(Button.EventType.CLICK, this.onNextLevel, this);
        }
        if (this.retryButton) {
            this.retryButton.node.off(Button.EventType.CLICK, this.onRetry, this);
        }
        if (this.shareButton) {
            this.shareButton.node.off(Button.EventType.CLICK, this.onShare, this);
        }
    }

    public show(fillRate: number): void {
        this._fillRate = fillRate;
        this.node.active = true;
        this.titleLabel.string = this.getRankText(fillRate);
        this.fillRateLabel.string = `填充率: ${(fillRate * 100).toFixed(1)}%`;
    }

    public hide(): void {
        this.node.active = false;
    }

    private getRankText(fillRate: number): string {
        if (fillRate >= 0.99) return '空间管理大师！';
        if (fillRate >= 0.95) return '挤挤总会有的';
        if (fillRate >= 0.90) return '就这？';
        return '继续努力';
    }

    private onNextLevel(): void {
        const currentLevel = GameManager.instance.currentLevel;
        if (currentLevel < 20) {
            GameManager.instance.loadLevel(currentLevel + 1);
        }
        this.hide();
    }

    private onRetry(): void {
        GameManager.instance.loadLevel(GameManager.instance.currentLevel);
        this.hide();
    }

    private onShare(): void {
        // TODO: 调用 ShareManager 生成分享图片
        console.log('Share functionality to be implemented');
    }
}
