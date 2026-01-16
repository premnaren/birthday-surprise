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
            // Random sizes: Some tiny buds, some big blooms
            this.size = 0;
            this.maxSize = Math.random() * 25 + 12; 
            this.growthSpeed = Math.random() * 0.8 + 0.3;
            // Pretty Pinks, Purples, Oranges
            this.color = `hsl(${Math.random() * 60 + 320}, 90%, 65%)`; 
            
            this.stemHeight = 0;
            this.maxStemHeight = Math.random() * 120 + 60; // Taller stems
            
            // Curve factor: How much it bends left or right
            this.bendOffset = Math.random() * 80 - 40; 
            
            // Random rotation for the flower head so they don't all look aligned
            this.rotation = Math.random() * Math.PI * 2;
        }

        grow() {
            if (this.stemHeight < this.maxStemHeight) {
                this.stemHeight += 2.5; // Grow stems faster
            } else if (this.size < this.maxSize) {
                this.size += this.growthSpeed;
            }
        }

        draw() {
            // Calculate tip position based on growth and bend
            const progress = this.stemHeight / this.maxStemHeight;
            const currentBend = this.bendOffset * progress;
            const tipX = this.x + currentBend;
            const tipY = this.y - this.stemHeight;

            // --- DRAW CURVED STEM ---
            if (this.stemHeight > 0) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                // Create smooth quadratic curve
                ctx.quadraticCurveTo(
                    this.x + (currentBend / 2), // Control point X
                    this.y - (this.stemHeight / 1.5), // Control point Y (lower down looks better)
                    tipX, tipY // End point
                );
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#4d908e'; // A nicer teal-green stem color
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            // --- DRAW FLOWER HEAD (Petals!) ---
            // Only draw head if stem has started
            if (this.stemHeight > 10) {
                ctx.save(); // Save current canvas state
                ctx.translate(tipX, tipY); // Move origin to flower tip
                ctx.rotate(this.rotation); // Rotate the whole flower slightly

                const petalCount = 6;
                const angleStep = (Math.PI * 2) / petalCount;
                // Petal size relative to overall flower size
                const petalSize = this.size * 0.5; 
                // How far out petals sit from center
                const petalRadius = this.size * 0.4; 

                ctx.fillStyle = this.color;
                
                // Draw 6 overlapping circles for petals
                for(let i = 0; i < petalCount; i++) {
                    const angle = i * angleStep;
                    const pX = Math.cos(angle) * petalRadius;
                    const pY = Math.sin(angle) * petalRadius;
                    ctx.beginPath();
                    ctx.arc(pX, pY, petalSize, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw Center Dot (Yellow pistil)
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
                ctx.fillStyle = '#ffd60a'; // Bright yellow
                ctx.fill();
                
                ctx.restore(); // Restore canvas state
            }
        }
    }

    // --- ANIMATION LOOP ---
    const animate = () => {
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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        flowersRef.current.push(new Flower(x, y));
    };

    window.addEventListener('mousedown', handleClick);
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
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: -1, pointerEvents: 'none' 
        }} 
    />
  );
};

export default FlowerGarden;