// assets/scripts/ui/TopBar.ts

import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc';
import { GameManager } from '../core/GameManager';
import { TextureGenerator } from '../utils/TextureGenerator';

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
        // 为按钮添加背景
        this.setupButtonBackground(this.backButton, '#B0E0E6');
        this.setupButtonBackground(this.pauseButton, '#E6E6FA');
        this.setupButtonBackground(this.retryButton, '#FFDAB9');

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

    private setupButtonBackground(button: Button, colorHex: string): void {
        if (!button) return;

        let sprite = button.node.getComponent(Sprite);
        if (!sprite) {
            sprite = button.node.addComponent(Sprite);
        }

        if (!sprite.spriteFrame) {
            const bgColor = new Color();
            Color.fromHEX(bgColor, colorHex);
            sprite.spriteFrame = TextureGenerator.createRoundedRectTexture(80, 60, 10, bgColor);
        }
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
