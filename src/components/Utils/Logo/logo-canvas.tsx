import React, { useEffect, useRef } from 'react';

interface Vertex {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

const LogoCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = 120;
                canvas.height = 120;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const scale = (size: number) => size / 8;

        const vertices: Vertex[] = [
            { x: scale(200), y: scale(50), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 },  // Top vertex
            { x: scale(300), y: scale(100), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 }, // Top-right vertex
            { x: scale(350), y: scale(200), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 }, // Bottom-right vertex
            { x: scale(300), y: scale(300), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 }, // Bottom vertex
            { x: scale(200), y: scale(350), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 }, // Bottom-left vertex
            { x: scale(100), y: scale(300), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 }, // Top-left vertex
            { x: scale(50), y: scale(200), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 },  // Left vertex
            { x: scale(100), y: scale(100), dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 }  // Top-left vertex
        ];

        const lines: [number, number][] = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
            [0, 2], [0, 3], [0, 5], [0, 6], [1, 3], [1, 4], [1, 6], [1, 7],
            [2, 4], [2, 5], [2, 7], [3, 5], [3, 6], [3, 7], [4, 6], [4, 7],
            [5, 7], [6, 2]
        ];

        const draw = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            vertices.forEach(vertex => {
                vertex.x += vertex.dx * 0.3;
                vertex.y += vertex.dy * 0.3;

                if (vertex.x <= 0 || vertex.x >= canvas.width) vertex.dx *= -1;
                if (vertex.y <= 0 || vertex.y >= canvas.height) vertex.dy *= -1;
            });

            ctx.strokeStyle = '#008080';
            ctx.lineWidth = 0.5;

            lines.forEach(([start, end]) => {
                ctx.beginPath();
                ctx.moveTo(vertices[start].x, vertices[start].y);
                ctx.lineTo(vertices[end].x, vertices[end].y);
                ctx.stroke();
            });

            setTimeout(() => {
                requestAnimationFrame(draw);
            }, 50);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div style={{ width: '80px', height: '80px', position: 'relative' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
        </div>
    );
};

export default LogoCanvas;
