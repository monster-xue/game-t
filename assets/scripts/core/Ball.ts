// assets/scripts/core/Ball.ts

import { _decorator, Component, Node, Sprite, Color, UITransform, Vec2, RigidBody2D, CircleCollider2D, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
import { GAME_CONFIG } from './GameConstants';
import { VibrationManager, VibrateType } from '../systems/VibrationManager';
import { PhysicsManager } from './PhysicsManager';
import { TextureGenerator } from '../utils/TextureGenerator';

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

        // 注册碰撞回调
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    onDestroy() {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }

    private onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (this.isDragging) return;

        const speed = PhysicsManager.instance.getBallSpeed(this.rigidBody);

        if (speed > GAME_CONFIG.VIBRATION.COLLISION_THRESHOLD) {
            VibrationManager.vibrate(VibrateType.LIGHT);
        }
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

        // 设置颜色并生成圆形纹理
        const color = new Color();
        Color.fromHEX(color, config.color);
        this.sprite.spriteFrame = TextureGenerator.createGradientCircleTexture(config.radius, color);
        this.sprite.color = new Color(255, 255, 255, 255); // 使用白色，让纹理颜色显示
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
