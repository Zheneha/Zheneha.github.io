/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.moving-image');
    const container = document.body;

    const imageStates = Array.from(images).map((image) => {
        const size = 300; // 画像のサイズ
        const speed = 7.0; // 移動速度

        // 初期位置をランダムに設定
        const initialX = Math.random() * (container.clientWidth - size);
        const initialY = Math.random() * (container.clientHeight - size);
        
        // 初期移動方向をランダムに設定
        const initialVX = (Math.random() < 0.5 ? 1 : -1) * speed;
        const initialVY = (Math.random() < 0.5 ? 1 : -1) * speed;

        // 初期回転角度と回転速度をランダムに設定
        const initialRotation = Math.random() * 360;
        const rotationSpeed = (Math.random() * 2 - 1) * 0.5; // -0.5度/frame から +0.5度/frame の範囲

        image.style.width = `${size}px`;
        image.style.height = `${size}px`;
        image.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${initialRotation}deg)`;

        return {
            element: image,
            x: initialX,
            y: initialY,
            vx: initialVX,
            vy: initialVY,
            rotation: initialRotation,
            rotationSpeed: rotationSpeed,
            size: size
        };
    });

    function animate() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        imageStates.forEach(state => {
            // 1. 位置の更新
            state.x += state.vx;
            state.y += state.vy;

            // 2. 回転角度の更新
            state.rotation += state.rotationSpeed;
            state.rotation %= 360; // 360度でループ

            // 3. 境界チェックと跳ね返り (X軸)
            let collidedX = false;
            if (state.x + state.size > containerWidth || state.x < 0) {
                state.vx *= -1; 
                if (state.x < 0) state.x = 0;
                if (state.x + state.size > containerWidth) state.x = containerWidth - state.size;
                collidedX = true;
            }

            // 4. 境界チェックと跳ね返り (Y軸)
            let collidedY = false;
            if (state.y + state.size > containerHeight || state.y < 0) {
                state.vy *= -1;
                if (state.y < 0) state.y = 0;
                if (state.y + state.size > containerHeight) state.y = containerHeight - state.size;
                collidedY = true;
            }

            // 5. 衝突時に回転速度と方向をランダムに変化させる
            if (collidedX || collidedY) {
                // 新しい回転速度を-0.7度/frameから+0.7度/frameの範囲で再設定
                state.rotationSpeed = (Math.random() * 2 - 1) * 20; 
            }

            // 6. CSSの更新
            state.element.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
});