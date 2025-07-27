import { useState, useEffect } from "react";

const terminalLines = [
  "> initializing...",
  "> connecting to server...",
  "> establishing secure connection...",
  "> VPN active...",
  "> loading web modules...",
  "> deploying AI chatbot...",
  "> web bot deployed...",
  "> social media boosting active...",
  "> ANONYMIKETECH systems online...",
  "> ready for hacking...",
];

export default function Terminal() {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setIsComplete(true);
      return;
    }

    const targetText = terminalLines[currentLine];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= targetText.length) {
        setCurrentText(targetText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
          setCurrentText("");
        }, 800);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentLine]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="terminal-window rounded-lg p-6 font-tech text-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-hacker-green-dim">
          ANONYMIKETECH Terminal
        </span>
      </div>

      <div className="space-y-1">
        {terminalLines.slice(0, currentLine).map((line, index) => (
          <div key={index} className="text-hacker-green-bright">
            {line}
          </div>
        ))}

        {currentLine < terminalLines.length && (
          <div className="text-hacker-green-bright">
            {currentText}
            {showCursor && (
              <span className="inline-block w-2 h-4 bg-hacker-green ml-1 animate-blink"></span>
            )}
          </div>
        )}

        {isComplete && (
          <div className="text-hacker-green glow-text mt-4 animate-flicker">
            █ SYSTEM READY █
          </div>
        )}
      </div>
    </div>
  );
}
