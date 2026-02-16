// assets/scripts/ui/TopBar.ts

import { _decorator, Component, Node, Label, Button } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('TopBar')
export class TopBar extends Component {
    @property(Button)
    backButton: Button = null;

    @property(Label)
    levelLabel: Label = null;

    @property(Button)
    pauseButton: Button = null;

    @property(Button)
    retryButton: Button = null;

    onLoad() {
        // 注册按钮事件
        if (this.backButton) {
            this.backButton.node.on(Button.EventType.CLICK, this.onBack, this);
        }
        if (this.pauseButton) {
            this.pauseButton.node.on(Button.EventType.CLICK, this.onPause, this);
        }
        if (this.retryButton) {
            this.retryButton.node.on(Button.EventType.CLICK, this.onRetry, this);
        }

        // 监听关卡变化
        this.updateLevelDisplay();
    }

    onDestroy() {
        // 移除事件监听
        if (this.backButton) {
            this.backButton.node.off(Button.EventType.CLICK, this.onBack, this);
        }
        if (this.pauseButton) {
            this.pauseButton.node.off(Button.EventType.CLICK, this.onPause, this);
        }
        if (this.retryButton) {
            this.retryButton.node.off(Button.EventType.CLICK, this.onRetry, this);
        }
    }

    update(deltaTime: number) {
        // 实时更新关卡显示
        this.updateLevelDisplay();
    }

    private updateLevelDisplay(): void {
        if (!this.levelLabel) return;

        const currentLevel = GameManager.instance.currentLevel;
        this.levelLabel.string = `第 ${currentLevel} / 20 关`;
    }

    private onBack(): void {
        console.log('Back to menu');
        // TODO: 返回主菜单场景
        // director.loadScene('Launch');
    }

    private onPause(): void {
        console.log('Pause game');
        // TODO: 显示暂停面板
        // GameManager.instance.pauseGame();
    }

    private onRetry(): void {
        console.log('Retry level');
        GameManager.instance.loadLevel(GameManager.instance.currentLevel);
    }
}
