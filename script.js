document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.moving-image');
    const container = document.body;
    const baseSpeed = 7.0;

    // 画面サイズに応じた画像サイズ計算
    const determineSize = () => window.innerWidth <= 960 ? 200 : 300;

    let currentSize = determineSize();

    // 画像の状態管理
    const imageStates = Array.from(images).map((image) => {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // 初期位置
        const initialX = Math.random() * (containerWidth - currentSize - 40) + 20;
        const initialY = Math.random() * (containerHeight - currentSize - 40) + 20;

        // 初期速度（±baseSpeedの範囲）
        const vx = (Math.random() < 0.5 ? 1 : -1) * baseSpeed;
        const vy = (Math.random() < 0.5 ? 1 : -1) * baseSpeed;

        // 回転速度
        const initialRotation = Math.random() * 360;
        const rotationSpeed = (Math.random() * 2 - 1) * 6;

        image.style.width = `${currentSize}px`;
        image.style.height = `${currentSize}px`;
        image.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${initialRotation}deg)`;

        return {
            element: image,
            x: initialX,
            y: initialY,
            vx: vx,
            vy: vy,
            rotation: initialRotation,
            rotationSpeed: rotationSpeed,
            size: currentSize,
        };
    });

    // 画面リサイズ時の処理
    const updateImageDimensions = () => {
        const newSize = determineSize();
        if (newSize === currentSize) return;

        const oldSize = currentSize;
        currentSize = newSize;

        imageStates.forEach(state => {
            const oldX = state.x;
            const oldY = state.y;

            state.size = newSize;

            // サイズ変更後の位置を計算
            state.x = Math.min(oldX * newSize / oldSize, container.clientWidth - newSize - 10);
            state.y = Math.min(oldY * newSize / oldSize, container.clientHeight - newSize - 10);
            state.x = Math.max(state.x, 10);
            state.y = Math.max(state.y, 10);
        });
    };

    // アニメーションループ
    function animate() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        imageStates.forEach(state => {
            // 位置更新
            state.x += state.vx;
            state.y += state.vy;

            // 回転更新
            state.rotation += state.rotationSpeed;

            // 境界チェックと跳ね返り
            let bounced = false;

            if (state.x <= 0 || state.x + state.size >= containerWidth) {
                state.vx *= -1;
                state.x = state.x <= 0 ? 0 : containerWidth - state.size;
                bounced = true;
            }

            if (state.y <= 0 || state.y + state.size >= containerHeight) {
                state.vy *= -1;
                state.y = state.y <= 0 ? 0 : containerHeight - state.size;
                bounced = true;
            }

            // 跳ね返り時に速度と回転をランダム変動
            if (bounced) {
                // 速度変動
                const speedVariation = 0.7 + Math.random() * 0.6;
                state.vx = (state.vx > 0 ? 1 : -1) * baseSpeed * speedVariation;
                state.vy = (state.vy > 0 ? 1 : -1) * baseSpeed * speedVariation;

                // 回転速度のランダム変動
                state.rotationSpeed = (Math.random() * 2 - 1) * 8;
            }

            // CSS変換を適用
            state.element.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    // イベントリスナー設定
    window.addEventListener('resize', () => {
        updateImageDimensions();

        // リサイズ後の位置確認（画面外防止）
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        imageStates.forEach(state => {
            if (state.x + state.size > containerWidth) state.x = containerWidth - state.size - 10;
            if (state.x < 0) state.x = 10;
            if (state.y + state.size > containerHeight) state.y = containerHeight - state.size - 10;
            if (state.y < 0) state.y = 10;
        });
    });

    // アニメーション開始
    animate();
});
