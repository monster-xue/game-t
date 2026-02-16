// assets/scripts/core/ContainerManager.ts

import { _decorator, Component, Node, Vec2, Vec3, PolygonCollider2D, RigidBody2D, UITransform, Graphics } from 'cc';
import { GAME_CONFIG } from './GameConstants';
import { MovingContainer, MovementConfig } from '../physics/MovingContainer';

const { ccclass, property } = _decorator;

export interface ContainerConfig {
    type: 'polygon' | 'circle' | 'multi';
    vertices?: Array<{x: number, y: number}>;
    radius?: number;
    center?: {x: number, y: number};
    shapes?: any[];
}

@ccclass('ContainerManager')
export class ContainerManager extends Component {
    @property(Node)
    borderNode: Node = null;

    @property(Node)
    visualNode: Node = null;

    private _containerConfig: ContainerConfig;
    private _vertices: Array<{x: number, y: number}> = [];
    private _movingContainer: MovingContainer = null;

    public init(config: ContainerConfig): void {
        this._containerConfig = config;

        // 清除旧的碰撞体
        this.removeColliders();

        // 停止旧的移动
        if (this._movingContainer) {
            this._movingContainer.stopMovement();
            this._movingContainer = null;
        }

        // 根据类型创建碰撞体
        switch (config.type) {
            case 'polygon':
                this.createPolygonContainer(config.vertices);
                break;
            case 'circle':
                this.createCircleContainer(config.radius, config.center);
                break;
            case 'multi':
                this.createMultiContainer(config.shapes);
                break;
        }
    }

    public enableMovingContainer(config: MovementConfig): void {
        if (!this._movingContainer) {
            this._movingContainer = this.borderNode.addComponent(MovingContainer);
        }
        this._movingContainer.init(config);
    }

    private createPolygonContainer(vertices: Array<{x: number, y: number}>): void {
        this._vertices = vertices;
        const points = vertices.map(v => new Vec2(v.x, v.y));

        // 创建刚体
        const rigidBody = this.borderNode.addComponent(RigidBody2D);
        rigidBody.type = RigidBody2D.Type.Static;

        // 创建多边形碰撞体
        const collider = this.borderNode.addComponent(PolygonCollider2D);
        collider.points = points;
        collider.restitution = 0.3;
        collider.friction = 0.5;
        collider.sensor = false;

        // 创建可视化边框
        this.createBorderVisual(vertices);
    }

    private createCircleContainer(radius: number, center: {x: number, y: number}): void {
        const segments = 32;
        const vertices: Array<{x: number, y: number}> = [];

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            vertices.push({
                x: Math.cos(angle) * radius + center.x,
                y: Math.sin(angle) * radius + center.y
            });
        }

        this.createPolygonContainer(vertices);
    }

    private createMultiContainer(shapes: any[]): void {
        // TODO: 实现多形状容器
        console.warn('Multi-container not implemented yet');
    }

    private createBorderVisual(vertices: Array<{x: number, y: number}>): void {
        if (!this.visualNode) {
            console.warn('VisualNode not assigned');
            return;
        }

        // 使用 Graphics 组件绘制边框
        const graphics = this.visualNode.getComponent(Graphics);
        if (!graphics) {
            const g = this.visualNode.addComponent(Graphics);
        }

        const g = this.visualNode.getComponent(Graphics);
        g.clear();

        // 绘制多边形边框
        if (vertices.length > 0) {
            g.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                g.lineTo(vertices[i].x, vertices[i].y);
            }
            g.close();

            // 设置样式并描边
            g.lineWidth = GAME_CONFIG.CONTAINER.BORDER_THICKNESS;
            g.strokeColor = new Color(74, 74, 74, 255); // 深灰色 #4A4A4A
            g.stroke();
        }
    }

    private removeColliders(): void {
        const colliders = this.borderNode.getComponents(PolygonCollider2D);
        for (const collider of colliders) {
            collider.destroy();
        }

        const rigidBodies = this.borderNode.getComponents(RigidBody2D);
        for (const rb of rigidBodies) {
            rb.destroy();
        }

        // 清除视觉
        if (this.visualNode) {
            const graphics = this.visualNode.getComponent(Graphics);
            if (graphics) {
                graphics.clear();
            }
        }
    }

    public checkBallsInside(balls: Node[]): boolean {
        for (const ballNode of balls) {
            if (!this.isBallInside(ballNode)) {
                return false;
            }
        }
        return true;
    }

    private isBallInside(ballNode: Node): boolean {
        const ballPos = ballNode.worldPosition;

        // 根据容器类型检测
        switch (this._containerConfig.type) {
            case 'polygon':
                return this.isInsidePolygon(ballPos);
            case 'circle':
                return this.isInsideCircle(ballPos);
            default:
                return true;
        }
    }

    private isInsidePolygon(pos: Vec3): boolean {
        // 使用射线法检测点是否在多边形内
        const vertices = this._vertices;
        let inside = false;

        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const xi = vertices[i].x, yi = vertices[i].y;
            const xj = vertices[j].x, yj = vertices[j].y;

            const intersect = ((yi > pos.y) !== (yj > pos.y)) &&
                (pos.x < (xj - xi) * (pos.y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    private isInsideCircle(pos: Vec3): boolean {
        const center = this._containerConfig.center || { x: 0, y: 0 };
        const radius = this._containerConfig.radius || 0;

        const dx = pos.x - center.x;
        const dy = pos.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < radius * GAME_CONFIG.CONTAINER.BUFFER_ZONE;
    }
}
