// assets/scripts/core/GameManager.ts

import { _decorator, Component, Node } from 'cc';
import { GameState, GAME_CONFIG } from './GameConstants';
import { LevelLoader } from './LevelLoader';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(LevelLoader)
    levelLoader: LevelLoader = null;

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
        // 游戏主循环逻辑,后续实现
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
