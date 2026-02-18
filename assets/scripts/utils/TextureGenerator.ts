import { SpriteFrame, Texture2D, Color } from 'cc';

/**
 * 纹理生成器 - 程序化生成游戏所需的各种纹理
 * 用于快速创建纯色、圆形、圆角矩形等基础纹理
 */
export class TextureGenerator {

    /**
     * 创建纯色纹理
     * @param width 宽度（像素）
     * @param height 高度（像素）
     * @param color 颜色
     * @returns SpriteFrame 对象
     */
    public static createSolidTexture(width: number, height: number, color: Color): SpriteFrame {
        const texture = new Texture2D();
        texture.reset({
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
        });

        const data = new Uint8Array(width * height * 4);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = color.r;
            data[i + 1] = color.g;
            data[i + 2] = color.b;
            data[i + 3] = color.a;
        }

        texture.imageData = data;
        texture.uploadData(data);

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    /**
     * 创建圆形纹理
     * @param radius 半径（像素）
     * @param color 颜色
     * @returns SpriteFrame 对象
     */
    public static createCircleTexture(radius: number, color: Color): SpriteFrame {
        const size = radius * 2;
        const texture = new Texture2D();
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888,
        });

        const data = new Uint8Array(size * size * 4);
        const centerX = radius;
        const centerY = radius;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const index = (y * size + x) * 4;
                if (distance <= radius) {
                    // 圆形内部 - 添加简单的抗锯齿边缘
                    let alpha = color.a;
                    if (distance > radius - 1.5) {
                        // 边缘渐变，实现抗锯齿
                        const edgeFactor = radius - distance;
                        alpha = Math.floor(alpha * edgeFactor / 1.5);
                    }
                    data[index] = color.r;
                    data[index + 1] = color.g;
                    data[index + 2] = color.b;
                    data[index + 3] = alpha;
                } else {
                    // 圆形外部 - 完全透明
                    data[index + 3] = 0;
                }
            }
        }

        texture.imageData = data;
        texture.uploadData(data);

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    /**
     * 创建圆角矩形纹理
     * @param width 宽度（像素）
     * @param height 高度（像素）
     * @param radius 圆角半径（像素）
     * @param color 颜色
     * @returns SpriteFrame 对象
     */
    public static createRoundedRectTexture(
        width: number,
        height: number,
        radius: number,
        color: Color
    ): SpriteFrame {
        const texture = new Texture2D();
        texture.reset({
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
        });

        const data = new Uint8Array(width * height * 4);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;

                // 检查是否在圆角区域
                let alpha = color.a;
                let isCorner = false;

                if (x < radius && y < radius) { // 左上
                    const dx = radius - x;
                    const dy = radius - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > radius) {
                        isCorner = true;
                    } else if (distance > radius - 1.5) {
                        // 抗锯齿边缘
                        const edgeFactor = radius - distance;
                        alpha = Math.floor(alpha * edgeFactor / 1.5);
                    }
                } else if (x >= width - radius && y < radius) { // 右上
                    const dx = x - (width - radius);
                    const dy = radius - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > radius) {
                        isCorner = true;
                    } else if (distance > radius - 1.5) {
                        const edgeFactor = radius - distance;
                        alpha = Math.floor(alpha * edgeFactor / 1.5);
                    }
                } else if (x < radius && y >= height - radius) { // 左下
                    const dx = radius - x;
                    const dy = y - (height - radius);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > radius) {
                        isCorner = true;
                    } else if (distance > radius - 1.5) {
                        const edgeFactor = radius - distance;
                        alpha = Math.floor(alpha * edgeFactor / 1.5);
                    }
                } else if (x >= width - radius && y >= height - radius) { // 右下
                    const dx = x - (width - radius);
                    const dy = y - (height - radius);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > radius) {
                        isCorner = true;
                    } else if (distance > radius - 1.5) {
                        const edgeFactor = radius - distance;
                        alpha = Math.floor(alpha * edgeFactor / 1.5);
                    }
                }

                if (isCorner) {
                    data[index] = 0;
                    data[index + 1] = 0;
                    data[index + 2] = 0;
                    data[index + 3] = 0;
                } else {
                    data[index] = color.r;
                    data[index + 1] = color.g;
                    data[index + 2] = color.b;
                    data[index + 3] = alpha;
                }
            }
        }

        texture.imageData = data;
        texture.uploadData(data);

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    /**
     * 创建渐变圆形纹理（用于团子效果）
     * @param radius 半径（像素）
     * @param color 主颜色
     * @returns SpriteFrame 对象
     */
    public static createGradientCircleTexture(radius: number, color: Color): SpriteFrame {
        const size = radius * 2;
        const texture = new Texture2D();
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888,
        });

        const data = new Uint8Array(size * size * 4);
        const centerX = radius;
        const centerY = radius;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const index = (y * size + x) * 4;
                if (distance <= radius) {
                    // 圆形内部 - 添加中心高光效果
                    let r = color.r;
                    let g = color.g;
                    let b = color.b;
                    let a = color.a;

                    // 中心高光
                    if (distance < radius * 0.6) {
                        const highlightFactor = 1 - (distance / (radius * 0.6)) * 0.3;
                        r = Math.min(255, Math.floor(r * highlightFactor + 30));
                        g = Math.min(255, Math.floor(g * highlightFactor + 30));
                        b = Math.min(255, Math.floor(b * highlightFactor + 30));
                    }

                    // 边缘阴影
                    if (distance > radius * 0.8) {
                        const shadowFactor = 1 - (distance - radius * 0.8) / (radius * 0.2);
                        r = Math.floor(r * shadowFactor);
                        g = Math.floor(g * shadowFactor);
                        b = Math.floor(b * shadowFactor);
                    }

                    // 抗锯齿边缘
                    if (distance > radius - 1.5) {
                        const edgeFactor = radius - distance;
                        a = Math.floor(a * edgeFactor / 1.5);
                    }

                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = a;
                } else {
                    data[index + 3] = 0;
                }
            }
        }

        texture.imageData = data;
        texture.uploadData(data);

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    /**
     * 创建带边框的圆形纹理（用于容器边界）
     * @param radius 半径（像素）
     * @param borderColor 边框颜色
     * @param borderThickness 边框厚度（像素）
     * @returns SpriteFrame 对象
     */
    public static createBorderedCircleTexture(
        radius: number,
        borderColor: Color,
        borderThickness: number = 2
    ): SpriteFrame {
        const size = radius * 2;
        const texture = new Texture2D();
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888,
        });

        const data = new Uint8Array(size * size * 4);
        const centerX = radius;
        const centerY = radius;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const index = (y * size + x) * 4;
                if (distance <= radius && distance >= radius - borderThickness) {
                    // 边框区域
                    let alpha = borderColor.a;
                    // 抗锯齿
                    if (distance > radius - 1.5 || distance < radius - borderThickness + 1.5) {
                        const edgeFactor = Math.min(
                            radius - distance + 1.5,
                            distance - (radius - borderThickness) + 1.5
                        ) / 1.5;
                        alpha = Math.min(255, Math.floor(alpha * edgeFactor));
                    }

                    data[index] = borderColor.r;
                    data[index + 1] = borderColor.g;
                    data[index + 2] = borderColor.b;
                    data[index + 3] = alpha;
                } else {
                    data[index + 3] = 0;
                }
            }
        }

        texture.imageData = data;
        texture.uploadData(data);

        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }
}
