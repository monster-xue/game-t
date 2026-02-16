// assets/scripts/core/LevelLoader.ts

import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
import { BallManager } from './BallManager';
import { ContainerManager, ContainerConfig } from './ContainerManager';
import { Ball, BallConfig } from './Ball';

const { ccclass, property } = _decorator;

export interface LevelConfig {
    id: number;
    name: string;
    container: ContainerConfig;
    balls: BallConfig[];
    winCondition: {
        fillRate: number;
        stableTime: number;
    };
    specialBehavior?: string;
    containerMovement?: any;
}

@ccclass('LevelLoader')
export class LevelLoader extends Component {
    @property(BallManager)
    ballManager: BallManager = null;

    @property(ContainerManager)
    containerManager: ContainerManager = null;

    private _currentLevel: LevelConfig = null;

    public loadLevel(levelId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load('data/levels', JsonAsset, (err, asset) => {
                if (err) {
                    console.error('Failed to load levels:', err);
                    reject(err);
                    return;
                }

                const data = asset.json;
                const level = data.levels.find((l: LevelConfig) => l.id === levelId);

                if (!level) {
                    console.error(`Level ${levelId} not found`);
                    reject(new Error(`Level ${levelId} not found`));
                    return;
                }

                this._currentLevel = level;
                this.initLevel(level);
                resolve();
            });
        });
    }

    private initLevel(level: LevelConfig): void {
        // 清除旧团子
        this.ballManager.clearBalls();

        // 初始化容器
        this.containerManager.init(level.container);

        // 创建团子
        for (const ballConfig of level.balls) {
            this.ballManager.createBall(ballConfig);
        }

        console.log(`Level ${level.id} (${level.name}) loaded`);
    }

    public getCurrentLevel(): LevelConfig {
        return this._currentLevel;
    }
}
