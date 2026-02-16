// assets/scripts/core/PhysicsManager.ts

import { _decorator, Component, Node, Vec2, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GAME_CONFIG } from './GameConstants';

const { ccclass, property } = _decorator;

export interface PhysicsConfig {
    gravity: Vec2;
    step: number;
    velocityIterations: number;
    positionIterations: number;
}

export interface CollisionCallback {
    onBeginContact?: (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) => void;
    onEndContact?: (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) => void;
}

@ccclass('PhysicsManager')
export class PhysicsManager extends Component {
    private static _instance: PhysicsManager;
    private _accumulatedTime: number = 0;
    private _collisionCallbacks: Map<string, CollisionCallback> = new Map();

    public static get instance(): PhysicsManager {
        return PhysicsManager._instance;
    }

    onLoad() {
        if (PhysicsManager._instance) {
            this.destroy();
            return;
        }
        PhysicsManager._instance = this;

        this.setupPhysicsWorld();
    }

    private setupPhysicsWorld() {
        const physicsWorld = this.node.scene.getComponent('cc.PhysicsWorld');
        if (physicsWorld) {
            physicsWorld.gravity = new Vec2(
                GAME_CONFIG.PHYSICS.GRAVITY.x,
                GAME_CONFIG.PHYSICS.GRAVITY.y
            );
        }
    }

    update(deltaTime: number) {
        // 物理步进由 Cocos 自动处理
    }

    public registerCollisionCallback(nodeUuid: string, callback: CollisionCallback) {
        this._collisionCallbacks.set(nodeUuid, callback);
    }

    public unregisterCollisionCallback(nodeUuid: string) {
        this._collisionCallbacks.delete(nodeUuid);
    }

    public getBallVelocity(body: RigidBody2D): Vec2 {
        return body.linearVelocity;
    }

    public getBallSpeed(body: RigidBody2D): number {
        return body.linearVelocity.length();
    }
}
