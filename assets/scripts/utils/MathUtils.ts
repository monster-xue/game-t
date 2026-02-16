// assets/scripts/utils/MathUtils.ts

import { Vec2, Vec3 } from 'cc';

/**
 * 数学工具类
 */
export class MathUtils {
    /**
     * 线性插值
     * @param a 起始值
     * @param b 目标值
     * @param t 插值因子 (0-1)
     * @returns 插值结果
     */
    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /**
     * 限制数值在指定范围内
     * @param value 数值
     * @param min 最小值
     * @param max 最大值
     * @returns 限制后的数值
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * 计算两点距离
     * @param x1 点1 X坐标
     * @param y1 点1 Y坐标
     * @param x2 点2 X坐标
     * @param y2 点2 Y坐标
     * @returns 距离
     */
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 计算两个 Vec2 的距离
     * @param v1 向量1
     * @param v2 向量2
     * @returns 距离
     */
    public static distanceVec2(v1: Vec2, v2: Vec2): number {
        return Vec2.distance(v1, v2);
    }

    /**
     * 计算两个 Vec3 的距离
     * @param v1 向量1
     * @param v2 向量2
     * @returns 距离
     */
    public static distanceVec3(v1: Vec3, v2: Vec3): number {
        return Vec3.distance(v1, v2);
    }

    /**
     * 角度转弧度
     * @param degrees 角度
     * @returns 弧度
     */
    public static degToRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * 弧度转角度
     * @param radians 弧度
     * @returns 角度
     */
    public static radToDeg(radians: number): number {
        return radians * (180 / Math.PI);
    }

    /**
     * 判断点是否在矩形内
     * @param px 点 X坐标
     * @param py 点 Y坐标
     * @param rx 矩形 X坐标
     * @param ry 矩形 Y坐标
     * @param rw 矩形宽度
     * @param rh 矩形高度
     * @returns 是否在内
     */
    public static pointInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }

    /**
     * 判断点是否在圆形内
     * @param px 点 X坐标
     * @param py 点 Y坐标
     * @param cx 圆心 X坐标
     * @param cy 圆心 Y坐标
     * @param radius 半径
     * @returns 是否在内
     */
    public static pointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
        const dx = px - cx;
        const dy = py - cy;
        return (dx * dx + dy * dy) <= (radius * radius);
    }

    /**
     * 随机范围内的整数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机整数
     */
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 随机范围内的浮点数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机浮点数
     */
    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 平滑阻尼
     * @param current 当前值
     * @param target 目标值
     * @param currentVelocity 当前速度
     * @param smoothTime 平滑时间
     * @param deltaTime 时间增量
     * @returns [newValue, newVelocity]
     */
    public static smoothDamp(
        current: number,
        target: number,
        currentVelocity: { value: number },
        smoothTime: number,
        deltaTime: number
    ): number {
        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        const change = current - target;
        const temp = (currentVelocity.value + omega * change) * deltaTime;
        currentVelocity.value = (currentVelocity.value - omega * temp) * exp;
        return target + (change + temp) * exp;
    }
}
