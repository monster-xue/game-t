// assets/scripts/core/Ball.ts

import { _decorator, Component, Node, Sprite, Color, UITransform, Vec2, RigidBody2D, CircleCollider2D } from 'cc';
import { GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

export interface BallConfig {
    radius: number;
    color: string;
    position: Vec2;
}

@ccclass('Ball')
export class Ball extends Component {
    @property(Sprite)
    sprite: Sprite = null;

    @property(RigidBody2D)
    rigidBody: RigidBody2D = null;

    @property(CircleCollider2D)
    collider: CircleCollider2D = null;

    private _config: BallConfig;
    private _initialScale: Vec2 = new Vec2(1, 1);
    private _isDragging: boolean = false;

    onLoad() {
        if (!this.rigidBody) {
            this.rigidBody = this.node.addComponent(RigidBody2D);
        }
        if (!this.collider) {
            this.collider = this.node.addComponent(CircleCollider2D);
        }
        if (!this.sprite) {
            this.sprite = this.node.addComponent(Sprite);
        }

        this._initialScale = new Vec2(this.node.scale.x, this.node.scale.y);
    }

    public init(config: BallConfig): void {
        this._config = config;

        // 设置刚体参数
        this.rigidBody.type = RigidBody2D.Type.Dynamic;
        this.rigidBody.gravityScale = 1;
        this.rigidBody.linearDamping = GAME_CONFIG.BALL.LINEAR_DAMPING;
        this.rigidBody.angularDamping = GAME_CONFIG.BALL.ANGULAR_DAMPING;

        // 设置碰撞体
        this.collider.radius = config.radius;
        this.collider.density = GAME_CONFIG.BALL.DENSITY;
        this.collider.friction = GAME_CONFIG.BALL.FRICTION;
        this.collider.restitution = GAME_CONFIG.BALL.RESTITUTION;
        this.collider.sensor = false;

        // 设置节点大小
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(config.radius * 2, config.radius * 2);
        }

        // 设置位置
        this.node.setPosition(config.position.x, config.position.y);

        // 设置颜色
        const color = new Color();
        Color.fromHEX(color, config.color);
        this.sprite.color = color;
    }

    public get config(): BallConfig {
        return this._config;
    }

    public get radius(): number {
        return this._config?.radius || 0;
    }

    public set isDragging(value: boolean) {
        this._isDragging = value;

        // 拖拽时放大
        const scale = value ? GAME_CONFIG.BALL.DRAG_SCALE : 1;
        this.node.setScale(scale, scale, 1);

        // 拖拽时禁用物理模拟
        this.rigidBody.type = value ? RigidBody2D.Type.Kinematic : RigidBody2D.Type.Dynamic;
    }

    public get isDragging(): boolean {
        return this._isDragging;
    }
}
