'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/src/data/products";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { normalizeImageUrl } from "@/src/utils/image";

export default function Images({
  product, imgIdx, setImgIdx,
}: {
  product: Product;
  imgIdx: number;
  setImgIdx: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [scale, setScale]     = useState(1);
  const [pos,   setPos]       = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 700, height: 900 });

  const resetZoom = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const zoomIn  = () => setScale(s => Math.min(s + 0.5, 4));
  const zoomOut = () => setScale(s => { const n = Math.max(s - 0.5, 1); if (n === 1) setPos({x:0,y:0}); return n; });

  // Load image to get natural dimensions
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const maxWidth = 600; // Max width for container
      const maxHeight = 800; // Max height for container
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      // Scale down if too large
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      setImageSize({ width: Math.round(width), height: Math.round(height) });
    };
    img.src = normalizeImageUrl(product.images[imgIdx]);
  }, [product.images, imgIdx]);

  // Double-click to zoom
  const handleDblClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scale >= 3) { resetZoom(); } else { setScale(s => Math.min(s + 1, 3)); }
  };

  // Drag to pan when zoomed
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setDragging(false);

  // Touch pinch-to-zoom
  const [lastDist, setLastDist] = useState(0);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setLastDist(Math.hypot(dx, dy));
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (lastDist > 0) {
        const ratio = dist / lastDist;
        setScale(s => Math.max(1, Math.min(4, s * ratio)));
      }
      setLastDist(dist);
    }
  };

  const changeImage = (i: number) => {
    resetZoom();
    setImgIdx(i);
  };

  return (
    <>
      <div>
        {/* Main image with zoom */}
        <div className="prod-img-main"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onDoubleClick={handleDblClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          style={{ 
            cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
            maxWidth: '100%',
            margin: '0 auto'
          }}
        >
          <div style={{ transform:`scale(${scale}) translate(${pos.x/scale}px, ${pos.y/scale}px)`, transition:dragging?"none":"transform 0.2s", userSelect:"none" }}>
            <Image
              src={normalizeImageUrl(product.images[imgIdx])}
              alt={product.name}
              width={imageSize.width}
              height={imageSize.height}
              style={{ objectFit:"contain", width:"100%", height:"100%", display:"block", pointerEvents:"none" }}
              priority
              draggable={false}
            />
          </div>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div style={{ position:"absolute", inset:0, background:"rgba(26,26,24,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:5 }}>
              <span style={{ color:"#faf9f6", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", border:"1px solid rgba(250,249,246,0.6)", padding:"10px 22px" }}>
                غير متوفر
              </span>
            </div>
          )}

          {/* Zoom controls */}
          <div className="zoom-controls">
            <button onClick={e=>{e.stopPropagation();zoomIn();}}  className="zoom-btn" title="تكبير"><ZoomIn  size={16} strokeWidth={2}/></button>
            <button onClick={e=>{e.stopPropagation();zoomOut();}} className="zoom-btn" title="تصغير"><ZoomOut size={16} strokeWidth={2}/></button>
            {scale > 1 && <button onClick={e=>{e.stopPropagation();resetZoom();}} className="zoom-btn" title="إعادة ضبط"><RotateCcw size={14} strokeWidth={2}/></button>}
          </div>

          {/* Zoom hint */}
          <div className="zoom-hint">
            {scale > 1 ? `${Math.round(scale * 100)}%` : "انقر مرتين للتكبير"}
          </div>
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="prod-thumbs">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => changeImage(i)} className={`prod-thumb${imgIdx === i ? " active" : ""}`}>
                <Image width={200} height={200} src={normalizeImageUrl(img)} alt={`عرض ${i + 1}`}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .prod-img-main {
          position: relative;
          overflow: hidden;
          background: #f0ece4;
          margin-bottom: 10px;
          border-radius: 4px;
          -webkit-user-select: none;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Zoom controls */
        .zoom-controls {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          gap: 6px;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .prod-img-main:hover .zoom-controls { opacity: 1; }
        .zoom-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.92);
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          color: #0f172a;
          backdrop-filter: blur(4px);
          transition: all 0.18s;
        }
        .zoom-btn:hover { background: #f59e0b; border-color: #f59e0b; }

        .zoom-hint {
          position: absolute;
          bottom: 12px;
          left: 12px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          background: rgba(15,23,42,0.55);
          padding: 4px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .prod-img-main:hover .zoom-hint { opacity: 1; }

        /* Thumbnails */
        .prod-thumbs { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .prod-thumb { aspect-ratio:1; overflow:hidden; border:none; border-bottom:2.5px solid transparent; background:none; cursor:pointer; padding:0; opacity:0.55; transition:all 0.2s; }
        .prod-thumb:hover { opacity:0.85; }
        .prod-thumb.active { border-bottom-color:#1a1a18; opacity:1; }

        @media(max-width:600px){ .prod-thumbs { grid-template-columns:repeat(5,1fr); gap:6px; } }
      `}</style>
    </>
  );
}
