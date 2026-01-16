import React, { useRef, useEffect } from 'react';

const FlowerGarden = () => {
  const canvasRef = useRef(null);
  const flowersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- FLOWER LOGIC ---
    class Flower {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 0;
            this.maxSize = Math.random() * 20 + 15; // Random size
            this.growthSpeed = Math.random() * 0.5 + 0.2;
            this.color = `hsl(${Math.random() * 60 + 320}, 100%, 60%)`; // Random Pinks/Reds
            this.stemHeight = 0;
            this.maxStemHeight = Math.random() * 50 + 50;
        }

        grow() {
            if (this.stemHeight < this.maxStemHeight) {
                this.stemHeight += 2;
            } else if (this.size < this.maxSize) {
                this.size += this.growthSpeed;
            }
        }

        draw() {
            // Draw Stem
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y - this.stemHeight);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#2d6a4f'; // Dark green stem
            ctx.stroke();

            // Draw Flower only if stem is done growing
            if (this.stemHeight >= this.maxStemHeight) {
                ctx.beginPath();
                ctx.arc(this.x, this.y - this.stemHeight, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Inner dot
                ctx.beginPath();
                ctx.arc(this.x, this.y - this.stemHeight, this.size / 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffea00'; // Yellow center
                ctx.fill();
            }
        }
    }

    // --- ANIMATION LOOP ---
    const animate = () => {
        // Clear screen slightly for a "trail" effect, or fully to be clean
        // We won't clear it so flowers STAY on screen! 
        // But we need to redraw them to animate growth.
        // So we redraw the background first.
        
        // Actually, to make them "stay", we should only draw the new frame.
        // But to animate growth, we need to clear and redraw array.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        flowersRef.current.forEach((flower) => {
            flower.grow();
            flower.draw();
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();

    // --- INTERACTION ---
    const handleClick = (e) => {
        // Add a new flower at the click position
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        flowersRef.current.push(new Flower(x, y));
    };

    // Attach listener to WINDOW so we can click through buttons
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    return () => {
        window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1, // Puts it BEHIND everything else
            pointerEvents: 'none' // Lets clicks pass through to buttons
        }} 
    />
  );
};

export default FlowerGarden;