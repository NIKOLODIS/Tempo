import React, { useState, useEffect } from 'react';

const TimeMatrixApp = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const rings = 13;

  useEffect(() => {
    setTimeout(() => setIsAnimating(false), 600);
  }, []);

  const size = 600;
  const center = size / 2;
  const maxRadius = size * 0.44;
  const innerRadius = 38;
  const ringSpacing = (maxRadius - innerRadius) / rings;

  // Get point on heptagon at given day index and ring level
  const getPointOnHeptagon = (dayIndex, ringIndex) => {
    const angle = (dayIndex * 2 * Math.PI / 7) - Math.PI / 2;
    const radius = innerRadius + ringIndex * ringSpacing;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Get midpoint between two day vertices at given ring level (supports fractional ringIndex)
  const getMidpointOnRing = (dayIndex, ringIndex) => {
    const angle1 = (dayIndex * 2 * Math.PI / 7) - Math.PI / 2;
    const angle2 = ((dayIndex + 1) * 2 * Math.PI / 7) - Math.PI / 2;
    const midAngle = (angle1 + angle2) / 2;
    const radius = innerRadius + ringIndex * ringSpacing;
    return {
      x: center + radius * Math.cos(midAngle),
      y: center + radius * Math.sin(midAngle),
      angle: midAngle
    };
  };

  // Create heptagon path at given ring level
  const createHeptagonPath = (ringIndex) => {
    const points = [];
    for (let i = 0; i < 7; i++) {
      const point = getPointOnHeptagon(i, ringIndex);
      points.push(`${point.x},${point.y}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  // Create annular ring band path (non-overlapping donut segment)
  const createRingBandPath = (ringIndex) => {
    const outerPoints = [];
    const innerPoints = [];
    
    for (let i = 0; i < 7; i++) {
      const outerPoint = getPointOnHeptagon(i, ringIndex + 1);
      const innerPoint = getPointOnHeptagon(i, ringIndex);
      outerPoints.push(outerPoint);
      innerPoints.push(innerPoint);
    }
    
    let path = `M ${outerPoints[0].x},${outerPoints[0].y}`;
    for (let i = 1; i < 7; i++) {
      path += ` L ${outerPoints[i].x},${outerPoints[i].y}`;
    }
    path += ' Z';
    
    path += ` M ${innerPoints[0].x},${innerPoints[0].y}`;
    for (let i = 6; i >= 0; i--) {
      path += ` L ${innerPoints[i].x},${innerPoints[i].y}`;
    }
    path += ' Z';
    
    return path;
  };

  // Get color for each ring band
  const getRingColor = (ringIndex) => {
    const progress = 1 - (ringIndex / (rings - 1));
    const r = Math.round(80 - progress * 50);
    const g = Math.round(140 - progress * 80);
    const b = Math.round(200 - progress * 80);
    const alpha = 0.35 + progress * 0.55;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Get text position: at inner edge of cell, 2.5px from divider
  const getTextPosition = (dayIndex, ringIndex, isLeftSide) => {
    const angle1 = (dayIndex * 2 * Math.PI / 7) - Math.PI / 2;
    const angle2 = ((dayIndex + 1) * 2 * Math.PI / 7) - Math.PI / 2;
    const midAngle = (angle1 + angle2) / 2;
    
    // Inner edge of this cell is at ringIndex, position 2px outward from that
    const innerEdgeRadius = innerRadius + ringIndex * ringSpacing;
    const ringRadius = innerEdgeRadius + 2;
    
    // Base position on divider at this radius
    const baseX = center + ringRadius * Math.cos(midAngle);
    const baseY = center + ringRadius * Math.sin(midAngle);
    
    // Check if text will be flipped
    let rotationDeg = (midAngle * 180 / Math.PI) + 90;
    const flipped = rotationDeg > 90 && rotationDeg < 270;
    
    // 2.5px perpendicular offset from divider, flip direction when text is flipped
    const perpAngle = midAngle + Math.PI / 2;
    let offset = isLeftSide ? -2.5 : 2.5;
    if (flipped) {
      offset = -offset;
    }
    
    return {
      x: baseX + offset * Math.cos(perpAngle),
      y: baseY + offset * Math.sin(perpAngle),
      midAngle: midAngle,
      flipped: flipped
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)',
        transition: 'all 0.6s ease 0.2s'
      }}>
        <h1 style={{
          fontSize: '13px',
          fontWeight: '400',
          margin: 0,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>Week Overview</h1>
      </div>

      {/* Main Heptagon Visualization */}
      <div style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: isAnimating ? 'scale(0.9)' : 'scale(1)',
            opacity: isAnimating ? 0 : 1,
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <defs>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3a3a3a" />
              <stop offset="100%" stopColor="#1e1e1e" />
            </radialGradient>
            
            <clipPath id="heptagonClip">
              <path d={createHeptagonPath(rings)} />
            </clipPath>
          </defs>

          {/* Ring bands */}
          {Array.from({ length: rings }, (_, i) => rings - 1 - i).map(ringIndex => (
            <path
              key={`ring-band-${ringIndex}`}
              d={createRingBandPath(ringIndex)}
              fill={getRingColor(ringIndex)}
              fillRule="evenodd"
              stroke="none"
              style={{
                opacity: isAnimating ? 0 : 1,
                transition: `opacity 0.4s ease ${(rings - 1 - ringIndex) * 0.04}s`
              }}
            />
          ))}

          {/* Concentric heptagon border lines */}
          {Array.from({ length: rings + 1 }, (_, i) => i).map(ringIndex => (
            <path
              key={`ring-line-${ringIndex}`}
              d={createHeptagonPath(ringIndex)}
              fill="none"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.2"
              style={{
                opacity: isAnimating ? 0 : 1,
                transition: `opacity 0.4s ease ${ringIndex * 0.03}s`
              }}
            />
          ))}

          {/* Day spokes */}
          {days.map((day, dayIndex) => {
            const innerPoint = getPointOnHeptagon(dayIndex, 0);
            const outerPoint = getPointOnHeptagon(dayIndex, rings);
            return (
              <line
                key={`spoke-${dayIndex}`}
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="rgba(255, 255, 255, 0.28)"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Half-day dividers - ends at ring 11 */}
          {days.map((day, dayIndex) => {
            const innerPoint = getMidpointOnRing(dayIndex, 0);
            const outerPoint = getMidpointOnRing(dayIndex, 11);
            return (
              <line
                key={`divider-${dayIndex}`}
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1"
              />
            );
          })}

          {/* Hour labels - clipped to heptagon bounds */}
          <g clipPath="url(#heptagonClip)">
            {/* LEFT SIDE (23:00 inner → 11:00 outer) - text ENDS 2.5px from divider */}
            {days.map((day, dayIndex) => {
              return Array.from({ length: rings }, (_, i) => i).map(ringIndex => {
                const pos = getTextPosition(dayIndex, ringIndex, true);
                
                let rotationDeg = (pos.midAngle * 180 / Math.PI) + 90;
                if (pos.flipped) {
                  rotationDeg += 180;
                }
                
                const hour = 23 - ringIndex;
                
                return (
                  <text
                    key={`hour-left-${dayIndex}-${ringIndex}`}
                    x={pos.x}
                    y={pos.y}
                    fill="rgba(255, 255, 255, 0.65)"
                    fontSize="5"
                    fontWeight="400"
                    textAnchor="end"
                    dominantBaseline="middle"
                    transform={`rotate(${rotationDeg}, ${pos.x}, ${pos.y})`}
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </text>
                );
              });
            })}

            {/* RIGHT SIDE (00:00 inner → 12:00 outer) - text STARTS 2.5px from divider */}
            {days.map((day, dayIndex) => {
              return Array.from({ length: rings }, (_, i) => i).map(ringIndex => {
                const pos = getTextPosition(dayIndex, ringIndex, false);
                
                let rotationDeg = (pos.midAngle * 180 / Math.PI) + 90;
                if (pos.flipped) {
                  rotationDeg += 180;
                }
                
                const hour = ringIndex;
                
                return (
                  <text
                    key={`hour-right-${dayIndex}-${ringIndex}`}
                    x={pos.x}
                    y={pos.y}
                    fill="rgba(255, 255, 255, 0.65)"
                    fontSize="5"
                    fontWeight="400"
                    textAnchor="start"
                    dominantBaseline="middle"
                    transform={`rotate(${rotationDeg}, ${pos.x}, ${pos.y})`}
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </text>
                );
              });
            })}
          </g>

          {/* Day labels - 2.5px from ring 12 */}
          {days.map((day, dayIndex) => {
            const midPoint = getMidpointOnRing(dayIndex, 12);
            
            const angle1 = (dayIndex * 2 * Math.PI / 7) - Math.PI / 2;
            const angle2 = ((dayIndex + 1) * 2 * Math.PI / 7) - Math.PI / 2;
            const midAngle = (angle1 + angle2) / 2;
            
            let rotationDeg = (midAngle * 180 / Math.PI) + 90;
            if (rotationDeg > 90 && rotationDeg < 270) {
              rotationDeg += 180;
            }
            
            const labelDistance = 2.5;
            const labelX = midPoint.x + labelDistance * Math.cos(midAngle);
            const labelY = midPoint.y + labelDistance * Math.sin(midAngle);
            
            return (
              <text
                key={`day-label-${day}`}
                x={labelX}
                y={labelY}
                fill="rgba(255, 255, 255, 0.75)"
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${rotationDeg}, ${labelX}, ${labelY})`}
                style={{ cursor: 'pointer' }}
              >
                {day}
              </text>
            );
          })}

          {/* Center heptagon */}
          <path
            d={createHeptagonPath(0)}
            fill="url(#centerGradient)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <style>{`
        * {
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #1e1e1e;
        }
      `}</style>
    </div>
  );
};

export default TimeMatrixApp;
