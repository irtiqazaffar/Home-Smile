import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function MoveImageFullScreen() {
  const [position, setPosition] = useState({ top: 0, left: 0 }); // State to track image position
  const [size, setSize] = useState(60); // State to track image size
  const videoRef = useRef(null); // Reference for the video element
  const router = useRouter();
  const { image } = router.query; // Destructure the image from the query

  // Function to request camera access
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Set video source to the camera stream
      }
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  // Effect to handle camera access
  useEffect(() => {
    requestCameraAccess(); // Request camera access when the component mounts

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop()); // Stop each track to release the camera
        videoRef.current.srcObject = null; // Clear the video source
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Center the image when the component mounts
  useEffect(() => {
    const centerX = window.innerWidth / 2 - size / 2; // Center based on size
    const centerY = window.innerHeight / 2 - size / 2;
    setPosition({ top: centerY, left: centerX }); // Set initial position to center
  }, [size]);

  // Handle mouse down event
  const handleMouseDown = (e) => {
    const startX = e.clientX - position.left; // Calculate the offset
    const startY = e.clientY - position.top;

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - startX; // Update the position
      const newY = moveEvent.clientY - startY;

      setPosition({
        left: newX,
        top: newY,
      });
    };

    const handleMouseUp = () => {
      // Cleanup mouse move and mouse up events
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Add event listeners to handle mouse movement and releasing the mouse button
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle key down event for resizing the image
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      setSize((prevSize) => prevSize + 10); // Increase size
    } else if (e.key === 'ArrowDown') {
      setSize((prevSize) => Math.max(prevSize - 10, 10)); // Decrease size, minimum 10
    }
  };

  // Effect to handle key down event
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center overflow-hidden relative">
      {/* Video Element for Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
      />

      {/* Image that can be moved freely */}
      <img
        src={image} // Your image URL
        alt="Movable Image"
        className="absolute cursor-grab"
        style={{
          top: `${position.top}px`, // Positioning the image
          left: `${position.left}px`,
          height: `${size}px`, // Set the height based on state
          width: `${size}px`, // Set the width based on state
        }}
        onMouseDown={handleMouseDown} // Track the mouse down event
      />
    </div>
  );
}
