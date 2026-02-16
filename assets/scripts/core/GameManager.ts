// assets/scripts/core/GameManager.ts

import { _decorator, Component, Node } from 'cc';
import { GameState, GAME_CONFIG } from './GameConstants';
import { LevelLoader } from './LevelLoader';
import { ContainerManager } from './ContainerManager';
import { BallManager } from './BallManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(LevelLoader)
    levelLoader: LevelLoader = null;

    @property(ContainerManager)
    containerManager: ContainerManager = null;

    @property(BallManager)
    ballManager: BallManager = null;

    @property(Node)
    containerNode: Node = null;

    @property(Node)
    ballsNode: Node = null;

    @property(Node)
    uiNode: Node = null;

    private static _instance: GameManager;
    private _currentLevel: number = 1;
    private _gameState: GameState = GameState.MENU;
    private _stableTimer: number = 0;

    public static get instance(): GameManager {
        return GameManager._instance;
    }

    onLoad() {
        if (GameManager._instance) {
            this.destroy();
            return;
        }
        GameManager._instance = this;
    }

    start() {
        this.changeState(GameState.MENU);
    }

    update(deltaTime: number) {
        if (this._gameState === GameState.PLAYING) {
            this.updateGameLogic(deltaTime);
        }
    }

    private updateGameLogic(dt: number) {
        // 获取所有团子节点
        const balls = this.ballManager.getBalls().map(b => b.node);

        // 检测是否所有团子都在容器内
        const allInside = this.containerManager.checkBallsInside(balls);

        if (allInside) {
            this._stableTimer += dt;

            // 显示倒计时(可选)
            console.log(`Stable: ${this._stableTimer.toFixed(1)}s / ${GAME_CONFIG.WIN.STABLE_TIME}s`);

            if (this._stableTimer >= GAME_CONFIG.WIN.STABLE_TIME) {
                this.levelComplete();
            }
        } else {
            // 团子弹出,重置计时器
            if (this._stableTimer > 0) {
                console.log('Ball popped out! Timer reset.');
            }
            this._stableTimer = 0;
        }
    }

    private levelComplete(): void {
        this.changeState(GameState.WIN);

        // 计算填充率
        const fillRate = this.calculateFillRate();

        // 显示结算界面
        // const resultPanel = this.uiNode.getComponent(ResultPanel);
        // if (resultPanel) {
        //     resultPanel.show(fillRate);
        // }

        console.log(`Level Complete! Fill rate: ${(fillRate * 100).toFixed(1)}%`);
    }

    private calculateFillRate(): number {
        // TODO: 实现精确的填充率计算
        // 简化版本:基于团子数量
        const ballCount = this.ballManager.getBallCount();
        const levelData = this.levelLoader.getCurrentLevel();

        if (!levelData) return 0;

        // 简化假设:每个团子占据一定空间
        const ballArea = ballCount * 10000; // 假设每个团子10000面积
        const containerArea = 150000; // 假设容器150000面积

        return Math.min(ballArea / containerArea, 1);
    }

    public changeState(state: GameState) {
        this._gameState = state;
    }

    public async loadLevel(levelId: number) {
        this._currentLevel = levelId;
        this._stableTimer = 0;
        this.changeState(GameState.PLAYING);

        try {
            await this.levelLoader.loadLevel(levelId);
        } catch (error) {
            console.error('Failed to load level:', error);
        }
    }

    public get currentLevel(): number {
        return this._currentLevel;
    }

    public get gameState(): GameState {
        return this._gameState;
    }
}
