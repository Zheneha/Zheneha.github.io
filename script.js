document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.moving-image');
    const container = document.body;
    const speed = 7.0; // 移動速度

    // 現在の画面幅に基づいて画像のサイズを決定する (960px以下で200px、それ以外で300px)
    const determineSize = () => window.innerWidth <= 960 ? 200 : 300; 

    let currentSize = determineSize();
    
    // 画像の状態を初期化する
    const imageStates = Array.from(images).map((image) => {
        
        const initialX = Math.random() * (container.clientWidth - currentSize);
        const initialY = Math.random() * (container.clientHeight - currentSize);
        
        const initialVX = (Math.random() < 0.5 ? 1 : -1) * speed;
        const initialVY = (Math.random() < 0.5 ? 1 : -1) * speed;

        const initialRotation = Math.random() * 360;
        const rotationSpeed = (Math.random() * 2 - 1) * 6; // 初期回転速度

        image.style.width = `${currentSize}px`;
        image.style.height = `${currentSize}px`;
        image.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${initialRotation}deg)`;

        return {
            element: image,
            x: initialX,
            y: initialY,
            vx: initialVX,
            vy: initialVY,
            rotation: initialRotation,
            rotationSpeed: rotationSpeed,
            size: currentSize,
        };
    });

    /**
     * 画面サイズ変更時に画像のサイズと位置を更新する
     */
    const updateImageDimensions = () => {
        const newSize = determineSize();
        if (newSize === currentSize) return;

        const oldSize = currentSize;
        currentSize = newSize;

        imageStates.forEach(state => {
            state.size = newSize;
            
            // サイズ変更に伴う位置補正 (画面外に出ないように調整)
            state.x = Math.min(state.x * newSize / oldSize, container.clientWidth - newSize);
            state.y = Math.min(state.y * newSize / oldSize, container.clientHeight - newSize);
            state.x = Math.max(state.x, 0);
            state.y = Math.max(state.y, 0);
        });
    };
    
    /**
     * アニメーションループ内で各画像の動きを計算・適用する
     */
    function animate() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        imageStates.forEach(state => {
            // 位置と回転角度の更新
            state.x += state.vx;
            state.y += state.vy;
            state.rotation += state.rotationSpeed;
            state.rotation %= 360; 

            // 境界チェックと跳ね返り
            let collided = false;
            
            if (state.x + state.size > containerWidth || state.x < 0) {
                state.vx *= -1; 
                state.x = state.x < 0 ? 0 : containerWidth - state.size; 
                collided = true;
            }

            if (state.y + state.size > containerHeight || state.y < 0) {
                state.vy *= -1;
                state.y = state.y < 0 ? 0 : containerHeight - state.size; 
                collided = true;
            }

            // 境界衝突時に回転速度と方向をランダムに変化
            if (collided) {
                state.rotationSpeed = (Math.random() * 2 - 1) * 16; 
            }

            // CSSの更新
            state.element.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    // イベントリスナーの設定
    window.addEventListener('resize', () => {
        // サイズ変更時の処理
        updateImageDimensions();
        
        // リサイズ後の位置補正
        imageStates.forEach(state => {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            // 画面外に出ていれば補正
            if (state.x + state.size > containerWidth) state.x = containerWidth - state.size;
            if (state.x < 0) state.x = 0;
            if (state.y + state.size > containerHeight) state.y = containerHeight - state.size;
            if (state.y < 0) state.y = 0;
        });
    });

    animate();
});