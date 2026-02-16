// assets/scripts/systems/InputManager.ts

import { _decorator, Component, Node, input, Input, EventTouch, Vec3, Camera } from 'cc';
import { Ball } from '../core/Ball';
import { BallManager } from '../core/BallManager';
import { RigidBody2D } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component {
    @property(Camera)
    uiCamera: Camera = null;

    @property(BallManager)
    ballManager: BallManager = null;

    private _draggedBall: Ball = null;
    private _dragOffset: Vec3 = new Vec3();

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = this.getTouchWorldPosition(event);

        // 检测是否点击了团子
        const balls = this.ballManager.getBalls();
        for (const ball of balls) {
            const ballPos = ball.node.worldPosition;
            const distance = Vec3.distance(touchPos, ballPos);

            if (distance <= ball.radius) {
                this.startDragging(ball, touchPos);
                break;
            }
        }
    }

    private onTouchMove(event: EventTouch) {
        if (!this._draggedBall) return;

        const touchPos = this.getTouchWorldPosition(event);
        const newPos = new Vec3(
            touchPos.x - this._dragOffset.x,
            touchPos.y - this._dragOffset.y,
            0
        );

        this._draggedBall.node.worldPosition = newPos;
    }

    private onTouchEnd(event: EventTouch) {
        if (this._draggedBall) {
            this.stopDragging();
        }
    }

    private startDragging(ball: Ball, touchPos: Vec3) {
        this._draggedBall = ball;
        this._draggedBall.isDragging = true;

        const ballPos = ball.node.worldPosition;
        Vec3.subtract(this._dragOffset, touchPos, ballPos);
    }

    private stopDragging() {
        if (this._draggedBall) {
            this._draggedBall.isDragging = false;
            this._draggedBall = null;
        }
    }

    private getTouchWorldPosition(event: EventTouch): Vec3 {
        const pos = event.getUILocation();
        const uiPos = new Vec3(pos.x, pos.y, 0);

        if (this.uiCamera) {
            this.uiCamera.convertToUINode(uiPos, this.node, uiPos);
        }

        return uiPos;
    }
}
