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
            
            // 1. RANDOM SIZES (Big variation: 10px to 40px)
            this.size = 0;
            this.maxSize = Math.random() * 30 + 10; 
            
            this.growthSpeed = Math.random() * 0.8 + 0.3; // Some grow faster
            this.color = `hsl(${Math.random() * 90 + 310}, 100%, 60%)`; // Pinks, Purples, Reds
            
            this.stemHeight = 0;
            this.maxStemHeight = Math.random() * 100 + 50; // Taller stems
            
            // 2. THE CURVE (Bends left or right by -50px to +50px)
            this.bendOffset = Math.random() * 100 - 50; 
        }

        grow() {
            if (this.stemHeight < this.maxStemHeight) {
                this.stemHeight += 2;
            } else if (this.size < this.maxSize) {
                this.size += this.growthSpeed;
            }
        }

        draw() {
            // Calculate where the tip of the stem is right now
            const progress = this.stemHeight / this.maxStemHeight;
            const currentBend = this.bendOffset * progress;
            const tipX = this.x + currentBend;
            const tipY = this.y - this.stemHeight;

            // --- DRAW CURVED STEM ---
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            
            // Quadratic Curve: Control point is halfway up but only half the bend
            // This creates a smooth "C" or "S" like curve
            ctx.quadraticCurveTo(
                this.x + (currentBend / 2), // Control X
                this.y - (this.stemHeight / 2), // Control Y
                tipX, // End X
                tipY  // End Y
            );
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#2d6a4f'; // Dark green stem
            ctx.stroke();

            // --- DRAW FLOWER ---
            // Only draw the head if the stem has started growing
            if (this.stemHeight > 5) {
                ctx.beginPath();
                // The flower sits exactly at the "tip" calculated above
                ctx.arc(tipX, tipY, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Inner dot (Yellow center)
                ctx.beginPath();
                ctx.arc(tipX, tipY, this.size / 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffea00'; 
                ctx.fill();
            }
        }
    }

    // --- ANIMATION LOOP ---
    const animate = () => {
        // We clear the canvas every frame to animate the growth smoothly
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
        const rect = canvas.getBoundingClientRect();
        // Allow clicking anywhere
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        flowersRef.current.push(new Flower(x, y));
    };

    // Listen to Window clicks to catch clicks on top of buttons too
    window.addEventListener('mousedown', handleClick); // 'mousedown' feels faster than 'click'
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    return () => {
        window.removeEventListener('mousedown', handleClick);
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
            zIndex: -1, 
            pointerEvents: 'none' 
        }} 
    />
  );
};

export default FlowerGarden;