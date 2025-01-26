import { useCallback, useRef, useState } from "react";

export function useDraggable(initialWidth: number, minWidth = 300) {
    const [width, setWidth] = useState(initialWidth);
    const startX = useRef(0);
    const isDragging = useRef(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging.current) {
            const diff = startX.current - e.clientX;
            setWidth((prevWidth) => Math.max(minWidth, prevWidth + diff));
            startX.current = e.clientX;
        }
    }, [minWidth]);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.clientX;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);

    return { width, handleMouseDown };
}
