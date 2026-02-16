// assets/scripts/core/BallManager.ts

import { _decorator, Component, Node, instantiate, Prefab, Vec2 } from 'cc';
import { Ball, BallConfig } from './Ball';
import { PhysicsManager } from './PhysicsManager';
import { GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    ballPrefab: Prefab = null;

    @property(Node)
    containerNode: Node = null;

    private _balls: Ball[] = [];
    private _ballPool: Node[] = [];

    public createBall(config: BallConfig): Ball {
        let ballNode: Node;

        // 从对象池获取或创建新节点
        if (this._ballPool.length > 0) {
            ballNode = this._ballPool.pop()!;
        } else {
            if (this.ballPrefab) {
                ballNode = instantiate(this.ballPrefab);
            } else {
                ballNode = new Node('Ball');
                ballNode.addComponent(Ball);
            }
        }

        ballNode.setParent(this.containerNode);
        const ball = ballNode.getComponent(Ball);
        ball.init(config);

        this._balls.push(ball);
        return ball;
    }

    public destroyBall(ball: Ball): void {
        const index = this._balls.indexOf(ball);
        if (index !== -1) {
            this._balls.splice(index, 1);
            ball.node.setParent(null);
            this._ballPool.push(ball.node);
        }
    }

    public clearBalls(): void {
        for (const ball of this._balls) {
            ball.node.setParent(null);
            this._ballPool.push(ball.node);
        }
        this._balls = [];
    }

    public getBalls(): Ball[] {
        return this._balls;
    }

    public getBallCount(): number {
        return this._balls.length;
    }

    update(deltaTime: number) {
        this.updateDeformations(deltaTime);
    }

    private updateDeformations(dt: number): void {
        for (const ball of this._balls) {
            if (ball.isDragging) continue;

            const rigidBody = ball.node.getComponent('cc.RigidBody2D') as any;
            if (!rigidBody) continue;

            const velocity = PhysicsManager.instance.getBallVelocity(rigidBody);
            const speed = PhysicsManager.instance.getBallSpeed(rigidBody);

            // 计算形变因子
            const squashFactor = Math.min(speed / 500, GAME_CONFIG.BALL.MAX_SQUEEZE);

            // 应用形变(沿运动方向拉伸,垂直方向压缩)
            if (speed > 10) {
                const angle = Math.atan2(velocity.y, velocity.x);
                const scaleX = 1 + squashFactor;
                const scaleY = 1 - squashFactor * 0.5;

                ball.node.setScale(scaleX, scaleY, 1);
                ball.node.angle = angle * (180 / Math.PI);
            } else {
                // 恢复原始形状
                const currentScale = ball.node.scale;
                const lerpFactor = 1 - GAME_CONFIG.BALL.SQUEEZE_DECAY;
                ball.node.setScale(
                    this.lerp(currentScale.x, 1, lerpFactor),
                    this.lerp(currentScale.y, 1, lerpFactor),
                    1
                );
                ball.node.angle = this.lerp(ball.node.angle, 0, lerpFactor);
            }
        }
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
}
