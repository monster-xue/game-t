// assets/scripts/physics/MovingContainer.ts

import { _decorator, Component, Vec3, tween, Tween } from 'cc';

const { ccclass, property } = _decorator;

export interface MovementConfig {
    type: 'oscillate';
    axis: 'x' | 'y';
    amplitude: number;
    period: number;
}

@ccclass('MovingContainer')
export class MovingContainer extends Component {
    private _movementConfig: MovementConfig = null;
    private _tween: Tween<Node> = null;

    public init(config: MovementConfig): void {
        this._movementConfig = config;
        this.startMovement();
    }

    private startMovement(): void {
        if (!this._movementConfig) return;

        const { axis, amplitude, period } = this._movementConfig;
        const halfPeriod = period / 2;

        // 停止旧的移动
        this.stopMovement();

        this._tween = tween(this.node)
            .to(halfPeriod, {
                position: new Vec3(
                    axis === 'x' ? amplitude : 0,
                    axis === 'y' ? amplitude : 0,
                    0
                )
            })
            .to(halfPeriod, {
                position: new Vec3(0, 0, 0)
            })
            .union()
            .repeatForever()
            .start();
    }

    public stopMovement(): void {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
    }

    onDestroy(): void {
        this.stopMovement();
    }
}
