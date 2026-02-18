// assets/scripts/ui/LevelSelect.ts

import { _decorator, Component, Node, Button, Label, Prefab, instantiate, Color } from 'cc';
import { GameManager } from '../core/GameManager';
import { TextureGenerator } from '../utils/TextureGenerator';

const { ccclass, property } = _decorator;

@ccclass('LevelSelect')
export class LevelSelect extends Component {
    @property(Prefab)
    levelItemPrefab: Prefab = null;

    @property(Node)
    gridContainer: Node = null;

    private readonly TOTAL_LEVELS = 20;

    start() {
        this.generateLevelItems();
    }

    private generateLevelItems() {
        if (!this.gridContainer) {
            console.warn('GridContainer not assigned');
            return;
        }

        // 清空现有内容
        this.gridContainer.removeAllChildren();

        for (let i = 1; i <= this.TOTAL_LEVELS; i++) {
            const item = this.createLevelItem(i);
            item.setParent(this.gridContainer);
        }
    }

    private createLevelItem(levelId: number): Node {
        let item: Node;

        if (this.levelItemPrefab) {
            item = instantiate(this.levelItemPrefab);
        } else {
            // 如果没有预制体,创建基础结构
            item = this.createBasicLevelItem(levelId);
        }

        // 设置关卡号
        const label = item.getComponentInChildren(Label);
        if (label) {
            label.string = levelId.toString();
        }

        // 添加点击事件
        const button = item.getComponent(Button);
        if (button) {
            button.node.on(Button.EventType.CLICK, () => {
                this.onLevelSelected(levelId);
            }, this);
        }

        return item;
    }

    private createBasicLevelItem(levelId: number): Node {
        const item = new Node(`Level_${levelId}`);

        // 添加UITransform
        const transform = item.addComponent('cc.UITransform') as any;
        transform.setContentSize(100, 100);

        // 添加Button
        const button = item.addComponent(Button);

        // 添加背景Sprite - 使用圆角矩形纹理
        const sprite = item.addComponent('cc.Sprite') as any;
        const pinkColor = new Color();
        Color.fromHEX(pinkColor, '#FFB5C5');
        sprite.spriteFrame = TextureGenerator.createRoundedRectTexture(100, 100, 15, pinkColor);

        // 添加文字Label
        const labelNode = new Node('Label');
        labelNode.setParent(item);
        const label = labelNode.addComponent('cc.Label') as any;
        label.string = levelId.toString();
        label.fontSize = 40;
        // 设置标签位置居中
        const labelTransform = labelNode.addComponent('cc.UITransform') as any;
        labelTransform.setContentSize(80, 80);
        labelNode.setPosition(0, 0);

        return item;
    }

    private onLevelSelected(levelId: number) {
        console.log(`Selected level ${levelId}`);
        GameManager.instance.loadLevel(levelId);
    }
}
