// Utility to draw a coordinate system and plot points
function drawCoordinateSystem({
    points = [],
    userPoint = null,
    line = null,
    canvasId = 'coord-canvas',
    grid = true,
    showNumbers = false
} = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw grid
    if (grid) {
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let j = 0; j <= canvas.height; j += 30) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(canvas.width, j);
            ctx.stroke();
        }
        // Draw numbers on axes
        if (showNumbers) {
            ctx.font = '12px Arial';
            ctx.fillStyle = '#888';
            // x-axis numbers
            for (let x = -5; x <= 5; x++) {
                if (x === 0) continue;
                const cx = canvas.width / 2 + x * 30;
                ctx.fillText(x, cx - 6, canvas.height / 2 + 15);
            }
            // y-axis numbers
            for (let y = -5; y <= 5; y++) {
                if (y === 0) continue;
                const cy = canvas.height / 2 - y * 30;
                ctx.fillText(y, canvas.width / 2 + 8, cy + 4);
            }
            // Draw 0 at origin
            ctx.fillText('0', canvas.width / 2 + 4, canvas.height / 2 + 15);
        }
    }
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, canvas.height / 2);
    ctx.lineTo(canvas.width - 20, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(canvas.width / 2, canvas.height - 20);
    ctx.stroke();
    // Draw points
    points.forEach(([x, y], i) => {
        const cx = canvas.width / 2 + x * 30;
        const cy = canvas.height / 2 - y * 30;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
        ctx.fillStyle = i === 0 ? '#e74c3c' : '#2980b9';
        ctx.fill();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#222';
        ctx.fillText(`(${x},${y})`, cx + 8, cy - 8);
    });
    // Draw user point if present
    if (userPoint) {
        const [x, y] = userPoint;
        const cx = canvas.width / 2 + x * 30;
        const cy = canvas.height / 2 - y * 30;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
        ctx.fillStyle = '#f39c12';
        ctx.fill();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#f39c12';
        ctx.fillText(`(${x},${y})`, cx + 8, cy - 8);
    }
    // Draw line if needed
    if (line) {
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = -8; px <= 8; px += 0.1) {
            const py = line.m * px + line.b;
            const cx = canvas.width / 2 + px * 30;
            const cy = canvas.height / 2 - py * 30;
            if (px === -8) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
    }
}

window.drawCoordinateSystem = drawCoordinateSystem;
