// assets/scripts/utils/ObjectPool.ts

import { _decorator, Component, Node, Prefab, instantiate } from 'cc';

const { ccclass } = _decorator;

/**
 * 对象池类,用于节点复用,减少 GC 压力
 */
@ccclass('ObjectPool')
export class ObjectPool extends Component {
    private _pool: Node[] = [];
    private _prefab: Prefab = null;
    private _maxSize: number = 50;

    /**
     * 初始化对象池
     * @param prefab 预制体
     * @param initialSize 初始大小
     * @param maxSize 最大大小
     */
    public init(prefab: Prefab, initialSize: number = 5, maxSize: number = 50): void {
        this._prefab = prefab;
        this._maxSize = maxSize;

        // 预创建指定数量的对象
        for (let i = 0; i < initialSize; i++) {
            const node = this.createNewNode();
            node.active = false;
            this._pool.push(node);
        }
    }

    /**
     * 从对象池获取对象
     * @returns 节点
     */
    public acquire(): Node {
        let node: Node;

        if (this._pool.length > 0) {
            node = this._pool.pop()!;
        } else {
            node = this.createNewNode();
        }

        node.active = true;
        return node;
    }

    /**
     * 将对象放回对象池
     * @param node 节点
     */
    public release(node: Node): void {
        if (!node) return;

        node.active = false;
        node.setParent(null);

        // 如果对象池未满,则放回
        if (this._pool.length < this._maxSize) {
            this._pool.push(node);
        } else {
            // 对象池已满,销毁对象
            node.destroy();
        }
    }

    /**
     * 清空对象池
     */
    public clear(): void {
        for (const node of this._pool) {
            node.destroy();
        }
        this._pool = [];
    }

    /**
     * 获取对象池当前大小
     */
    public get size(): number {
        return this._pool.length;
    }

    /**
     * 创建新节点
     */
    private createNewNode(): Node {
        if (this._prefab) {
            return instantiate(this._prefab);
        } else {
            return new Node('PooledNode');
        }
    }

    onDestroy(): void {
        this.clear();
    }
}
