// assets/scripts/physics/ChainBodyBuilder.ts

import { _decorator, Component, Node, Vec2, RigidBody2D, CircleCollider2D, Joint2D, DistanceJoint2D, Sprite, Color, UITransform } from 'cc';
import { GAME_CONFIG } from '../core/GameConstants';

const { ccclass } = _decorator;

export interface ChainBallConfig {
    type: 'chain';
    segments: number;
    segmentRadius: number;
    color: string;
    position: {x: number, y: number};
}

@ccclass('ChainBodyBuilder')
export class ChainBodyBuilder extends Component {
    public createChainBall(config: ChainBallConfig, container: Node): Node[] {
        const segments: Node[] = [];
        const { segments: count, segmentRadius, color, position } = config;

        // 创建多个小圆球用关节连接
        for (let i = 0; i < count; i++) {
            const segmentNode = new Node(`ChainSegment_${i}`);
            segmentNode.setParent(container);

            // 添加刚体
            const rigidBody = segmentNode.addComponent(RigidBody2D);
            rigidBody.type = RigidBody2D.Type.Dynamic;
            rigidBody.gravityScale = 1;
            rigidBody.linearDamping = GAME_CONFIG.BALL.LINEAR_DAMPING;
            rigidBody.angularDamping = GAME_CONFIG.BALL.ANGULAR_DAMPING;

            // 添加碰撞体
            const collider = segmentNode.addComponent(CircleCollider2D);
            collider.radius = segmentRadius;
            collider.density = GAME_CONFIG.BALL.DENSITY;
            collider.friction = GAME_CONFIG.BALL.FRICTION;
            collider.restitution = GAME_CONFIG.BALL.RESTITUTION;
            collider.sensor = false;

            // 设置节点大小
            const transform = segmentNode.addComponent(UITransform);
            transform.setContentSize(segmentRadius * 2, segmentRadius * 2);

            // 设置位置(垂直排列)
            const yOffset = i * segmentRadius * 2;
            segmentNode.setPosition(position.x, position.y - yOffset, 0);

            // 添加 Sprite 组件用于渲染
            const sprite = segmentNode.addComponent(Sprite);
            const spriteColor = new Color();
            Color.fromHEX(spriteColor, color);
            sprite.color = spriteColor;

            segments.push(segmentNode);

            // 用关节连接到前一个节点
            if (i > 0) {
                this.connectWithJoint(segments[i - 1], segmentNode, segmentRadius);
            }
        }

        return segments;
    }

    private connectWithJoint(nodeA: Node, nodeB: Node, radius: number): void {
        const joint = nodeA.addComponent(Joint2D) as DistanceJoint2D;
        joint.connectedBody = nodeB.getComponent(RigidBody2D);

        // 设置关节属性
        joint.autoDistance = false;
        joint.distance = radius * 2;
        joint.dampingRatio = 0.5;
        joint.frequency = 10;
    }
}
