import React, { useEffect, useState, useRef } from 'react';
import { useDrag } from '@dnd-kit/core';

interface AlignmentGuidesProps {
  containerRef: React.RefObject<HTMLElement>;
  elementRef: React.RefObject<HTMLElement>;
  isDragging: boolean;
  snapThreshold?: number;
  showGuides?: boolean;
}

interface GuideLine {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
  label?: string;
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({
  containerRef,
  elementRef,
  isDragging,
  snapThreshold = 10,
  showGuides = true
}) => {
  const [guides, setGuides] = useState<GuideLine[]>([]);
  const [snapPosition, setSnapPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSnapped, setIsSnapped] = useState(false);

  useEffect(() => {
    if (!isDragging || !containerRef.current || !elementRef.current) {
      setGuides([]);
      setSnapPosition(null);
      setIsSnapped(false);
      return;
    }

    const container = containerRef.current;
    const element = elementRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const newGuides: GuideLine[] = [];
    let snapX = elementRect.left - containerRect.left;
    let snapY = elementRect.top - containerRect.top;

    // Get all other elements in the container
    const otherElements = Array.from(container.children).filter(
      child => child !== element && child instanceof HTMLElement
    ) as HTMLElement[];

    // Check alignment with container edges
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;

    // Center alignment
    const centerXDistance = Math.abs(elementRect.left - containerRect.left - containerCenterX + elementRect.width / 2);
    const centerYDistance = Math.abs(elementRect.top - containerRect.top - containerCenterY + elementRect.height / 2);

    if (centerXDistance < snapThreshold) {
      newGuides.push({
        id: 'container-center-x',
        type: 'vertical',
        position: containerCenterX,
        color: '#3b82f6',
        label: 'Center'
      });
      snapX = containerCenterX - elementRect.width / 2;
    }

    if (centerYDistance < snapThreshold) {
      newGuides.push({
        id: 'container-center-y',
        type: 'horizontal',
        position: containerCenterY,
        color: '#3b82f6',
        label: 'Center'
      });
      snapY = containerCenterY - elementRect.height / 2;
    }

    // Edge alignment
    const leftDistance = Math.abs(elementRect.left - containerRect.left);
    const rightDistance = Math.abs(elementRect.right - containerRect.right);
    const topDistance = Math.abs(elementRect.top - containerRect.top);
    const bottomDistance = Math.abs(elementRect.bottom - containerRect.bottom);

    if (leftDistance < snapThreshold) {
      newGuides.push({
        id: 'container-left',
        type: 'vertical',
        position: 0,
        color: '#10b981',
        label: 'Left Edge'
      });
      snapX = 0;
    }

    if (rightDistance < snapThreshold) {
      newGuides.push({
        id: 'container-right',
        type: 'vertical',
        position: containerRect.width - elementRect.width,
        color: '#10b981',
        label: 'Right Edge'
      });
      snapX = containerRect.width - elementRect.width;
    }

    if (topDistance < snapThreshold) {
      newGuides.push({
        id: 'container-top',
        type: 'horizontal',
        position: 0,
        color: '#10b981',
        label: 'Top Edge'
      });
      snapY = 0;
    }

    if (bottomDistance < snapThreshold) {
      newGuides.push({
        id: 'container-bottom',
        type: 'horizontal',
        position: containerRect.height - elementRect.height,
        color: '#10b981',
        label: 'Bottom Edge'
      });
      snapY = containerRect.height - elementRect.height;
    }

    // Check alignment with other elements
    otherElements.forEach((otherElement, index) => {
      const otherRect = otherElement.getBoundingClientRect();
      
      // Left edge alignment
      const leftAlignment = Math.abs(elementRect.left - otherRect.left);
      if (leftAlignment < snapThreshold) {
        newGuides.push({
          id: `element-${index}-left`,
          type: 'vertical',
          position: otherRect.left - containerRect.left,
          color: '#f59e0b',
          label: 'Align Left'
        });
        snapX = otherRect.left - containerRect.left;
      }

      // Right edge alignment
      const rightAlignment = Math.abs(elementRect.right - otherRect.right);
      if (rightAlignment < snapThreshold) {
        newGuides.push({
          id: `element-${index}-right`,
          type: 'vertical',
          position: otherRect.right - containerRect.left,
          color: '#f59e0b',
          label: 'Align Right'
        });
        snapX = otherRect.right - containerRect.left - elementRect.width;
      }

      // Top edge alignment
      const topAlignment = Math.abs(elementRect.top - otherRect.top);
      if (topAlignment < snapThreshold) {
        newGuides.push({
          id: `element-${index}-top`,
          type: 'horizontal',
          position: otherRect.top - containerRect.top,
          color: '#f59e0b',
          label: 'Align Top'
        });
        snapY = otherRect.top - containerRect.top;
      }

      // Bottom edge alignment
      const bottomAlignment = Math.abs(elementRect.bottom - otherRect.bottom);
      if (bottomAlignment < snapThreshold) {
        newGuides.push({
          id: `element-${index}-bottom`,
          type: 'horizontal',
          position: otherRect.bottom - containerRect.top,
          color: '#f59e0b',
          label: 'Align Bottom'
        });
        snapY = otherRect.bottom - containerRect.top - elementRect.height;
      }

      // Center alignment
      const centerXAlignment = Math.abs(
        elementRect.left + elementRect.width / 2 - (otherRect.left + otherRect.width / 2)
      );
      if (centerXAlignment < snapThreshold) {
        newGuides.push({
          id: `element-${index}-center-x`,
          type: 'vertical',
          position: otherRect.left + otherRect.width / 2 - containerRect.left,
          color: '#8b5cf6',
          label: 'Center X'
        });
        snapX = otherRect.left + otherRect.width / 2 - containerRect.left - elementRect.width / 2;
      }

      const centerYAlignment = Math.abs(
        elementRect.top + elementRect.height / 2 - (otherRect.top + otherRect.height / 2)
      );
      if (centerYAlignment < snapThreshold) {
        newGuides.push({
          id: `element-${index}-center-y`,
          type: 'horizontal',
          position: otherRect.top + otherRect.height / 2 - containerRect.top,
          color: '#8b5cf6',
          label: 'Center Y'
        });
        snapY = otherRect.top + otherRect.height / 2 - containerRect.top - elementRect.height / 2;
      }
    });

    setGuides(newGuides);
    
    if (newGuides.length > 0) {
      setSnapPosition({ x: snapX, y: snapY });
      setIsSnapped(true);
    } else {
      setSnapPosition(null);
      setIsSnapped(false);
    }
  }, [isDragging, containerRef, elementRef, snapThreshold]);

  if (!showGuides || !isDragging || guides.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {guides.map((guide) => (
        <div
          key={guide.id}
          className="absolute"
          style={{
            [guide.type === 'horizontal' ? 'top' : 'left']: `${guide.position}px`,
            [guide.type === 'horizontal' ? 'width' : 'height']: guide.type === 'horizontal' ? '100%' : '100%',
            [guide.type === 'horizontal' ? 'height' : 'width']: '1px',
            backgroundColor: guide.color,
            opacity: 0.8,
            zIndex: 1000
          }}
        >
          {guide.label && (
            <div
              className="absolute bg-white text-xs px-1 py-0.5 rounded shadow-sm"
              style={{
                [guide.type === 'horizontal' ? 'left' : 'top']: '4px',
                [guide.type === 'horizontal' ? 'top' : 'left']: '4px',
                color: guide.color,
                fontWeight: '500'
              }}
            >
              {guide.label}
            </div>
          )}
        </div>
      ))}
      
      {/* Snap indicator */}
      {isSnapped && snapPosition && (
        <div
          className="absolute bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg"
          style={{
            left: `${snapPosition.x}px`,
            top: `${snapPosition.y - 30}px`,
            zIndex: 1001
          }}
        >
          Snapped!
        </div>
      )}
    </div>
  );
};

// Hook for using alignment guides
export const useAlignmentGuides = (
  containerRef: React.RefObject<HTMLElement>,
  snapThreshold: number = 10
) => {
  const [guides, setGuides] = useState<GuideLine[]>([]);
  const [isSnapped, setIsSnapped] = useState(false);

  const checkAlignment = (
    elementRect: DOMRect,
    containerRect: DOMRect,
    otherElements: HTMLElement[]
  ) => {
    const newGuides: GuideLine[] = [];
    let snapX = elementRect.left - containerRect.left;
    let snapY = elementRect.top - containerRect.top;

    // Container alignment checks
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;

    // Center alignment
    const centerXDistance = Math.abs(elementRect.left - containerRect.left - containerCenterX + elementRect.width / 2);
    const centerYDistance = Math.abs(elementRect.top - containerRect.top - containerCenterY + elementRect.height / 2);

    if (centerXDistance < snapThreshold) {
      newGuides.push({
        id: 'container-center-x',
        type: 'vertical',
        position: containerCenterX,
        color: '#3b82f6',
        label: 'Center'
      });
      snapX = containerCenterX - elementRect.width / 2;
    }

    if (centerYDistance < snapThreshold) {
      newGuides.push({
        id: 'container-center-y',
        type: 'horizontal',
        position: containerCenterY,
        color: '#3b82f6',
        label: 'Center'
      });
      snapY = containerCenterY - elementRect.height / 2;
    }

    // Edge alignment
    const leftDistance = Math.abs(elementRect.left - containerRect.left);
    const rightDistance = Math.abs(elementRect.right - containerRect.right);
    const topDistance = Math.abs(elementRect.top - containerRect.top);
    const bottomDistance = Math.abs(elementRect.bottom - containerRect.bottom);

    if (leftDistance < snapThreshold) {
      newGuides.push({
        id: 'container-left',
        type: 'vertical',
        position: 0,
        color: '#10b981',
        label: 'Left Edge'
      });
      snapX = 0;
    }

    if (rightDistance < snapThreshold) {
      newGuides.push({
        id: 'container-right',
        type: 'vertical',
        position: containerRect.width - elementRect.width,
        color: '#10b981',
        label: 'Right Edge'
      });
      snapX = containerRect.width - elementRect.width;
    }

    if (topDistance < snapThreshold) {
      newGuides.push({
        id: 'container-top',
        type: 'horizontal',
        position: 0,
        color: '#10b981',
        label: 'Top Edge'
      });
      snapY = 0;
    }

    if (bottomDistance < snapThreshold) {
      newGuides.push({
        id: 'container-bottom',
        type: 'horizontal',
        position: containerRect.height - elementRect.height,
        color: '#10b981',
        label: 'Bottom Edge'
      });
      snapY = containerRect.height - elementRect.height;
    }

    setGuides(newGuides);
    setIsSnapped(newGuides.length > 0);

    return {
      guides: newGuides,
      snapPosition: newGuides.length > 0 ? { x: snapX, y: snapY } : null,
      isSnapped: newGuides.length > 0
    };
  };

  return {
    guides,
    isSnapped,
    checkAlignment
  };
};
