import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Info } from "lucide-react";

// Add custom CSS for better text visibility
const customStyles = `
  .text-shadow {
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  }
  
  .algorithm-bar {
    position: relative;
    display: flex;
    align-items: end;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .algorithm-bar span {
    position: absolute;
    bottom: 4px;
    font-size: 10px;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    line-height: 1;
  }
  
  @media (max-width: 640px) {
    .algorithm-bar span {
      font-size: 8px;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

// Utility function to generate random array
const generateRandomArray = (size) => {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 300) + 10
  );
};

// Bubble Sort Component
const BubbleSort = ({ array, onArrayChange, speed }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState({
    i: -1,
    j: -1,
    comparing: [],
    swapped: [],
    currentLine: -1,
  });
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef(null);

  const pseudoCode = [
    "for i = 0 to n-2:",
    "    for j = 0 to n-i-2:",
    "        if arr[j] > arr[j+1]:",
    "            swap arr[j] and arr[j+1]",
  ];

  const bubbleSort = async () => {
    setIsRunning(true);
    setCompleted(false);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      setCurrentStep({ i, j: -1, comparing: [], swapped: [], currentLine: 0 });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      for (let j = 0; j < n - i - 1; j++) {
        setCurrentStep({
          i,
          j,
          comparing: [j, j + 1],
          swapped: [],
          currentLine: 1,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        setCurrentStep({
          i,
          j,
          comparing: [j, j + 1],
          swapped: [],
          currentLine: 2,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        if (arr[j] > arr[j + 1]) {
          setCurrentStep({
            i,
            j,
            comparing: [j, j + 1],
            swapped: [],
            currentLine: 3,
          });
          await new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, speed);
          });

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setCurrentStep({
            i,
            j,
            comparing: [j, j + 1],
            swapped: [j, j + 1],
            currentLine: 3,
          });
          setCurrentArray([...arr]);
          await new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, speed);
          });
        }
      }
    }

    setCurrentStep({
      i: -1,
      j: -1,
      comparing: [],
      swapped: [],
      currentLine: -1,
    });
    setCompleted(true);
    setIsRunning(false);
    onArrayChange([...arr]);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setCurrentArray([...array]);
    setCurrentStep({
      i: -1,
      j: -1,
      comparing: [],
      swapped: [],
      currentLine: -1,
    });
    setCompleted(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Bubble Sort</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={bubbleSort}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Play size={16} />
              Start
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="flex items-end gap-1 h-80 border-b border-gray-300 p-4 relative">
            {currentArray.map((value, index) => (
              <div
                key={index}
                className={`algorithm-bar ${
                  currentStep.comparing.includes(index)
                    ? "bg-yellow-400"
                    : currentStep.swapped.includes(index)
                    ? "bg-red-400"
                    : completed
                    ? "bg-green-400"
                    : "bg-blue-400"
                }`}
                style={{
                  height: `${value}px`,
                  width: `${Math.max(800 / currentArray.length - 2, 20)}px`,
                  minWidth: "20px",
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Pseudo Code:</h4>
          <div className="font-mono text-sm space-y-1">
            {pseudoCode.map((line, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentStep.currentLine === index
                    ? "bg-yellow-200 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm">
            <p>
              <strong>Current Status:</strong>
            </p>
            <p>i = {currentStep.i >= 0 ? currentStep.i : "N/A"}</p>
            <p>j = {currentStep.j >= 0 ? currentStep.j : "N/A"}</p>
            {currentStep.comparing.length > 0 && (
              <p>
                Comparing: {currentArray[currentStep.comparing[0]]} and{" "}
                {currentArray[currentStep.comparing[1]]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">How Bubble Sort Works:</h4>
        <ul className="text-sm space-y-1">
          <li>• Compare adjacent elements</li>
          <li>• Swap if they're in wrong order</li>
          <li>• Repeat until no swaps needed</li>
          <li>• Time Complexity: O(n²)</li>
          <li>• Space Complexity: O(1)</li>
        </ul>
      </div>
    </div>
  );
};

// Insertion Sort Component
const InsertionSort = ({ array, onArrayChange, speed }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState({
    current: -1,
    comparing: [],
    sorted: [],
    currentLine: -1,
  });
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef(null);

  const pseudoCode = [
    "for i = 1 to n-1:",
    "    key = arr[i]",
    "    j = i - 1",
    "    while j >= 0 and arr[j] > key:",
    "        arr[j+1] = arr[j]",
    "        j = j - 1",
    "    arr[j+1] = key",
  ];

  const insertionSort = async () => {
    setIsRunning(true);
    setCompleted(false);
    const arr = [...array];
    const sorted = [0];

    for (let i = 1; i < arr.length; i++) {
      setCurrentStep({
        current: i,
        comparing: [i],
        sorted: [...sorted],
        currentLine: 0,
      });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      const key = arr[i];
      setCurrentStep({
        current: i,
        comparing: [i],
        sorted: [...sorted],
        currentLine: 1,
      });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      let j = i - 1;
      setCurrentStep({
        current: i,
        comparing: [i],
        sorted: [...sorted],
        currentLine: 2,
      });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      while (j >= 0 && arr[j] > key) {
        setCurrentStep({
          current: i,
          comparing: [j, j + 1],
          sorted: [...sorted],
          currentLine: 3,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        setCurrentStep({
          current: i,
          comparing: [j, j + 1],
          sorted: [...sorted],
          currentLine: 4,
        });
        arr[j + 1] = arr[j];
        setCurrentArray([...arr]);
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        setCurrentStep({
          current: i,
          comparing: [j, j + 1],
          sorted: [...sorted],
          currentLine: 5,
        });
        j--;
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });
      }

      setCurrentStep({
        current: i,
        comparing: [],
        sorted: [...sorted],
        currentLine: 6,
      });
      arr[j + 1] = key;
      sorted.push(i);
      setCurrentArray([...arr]);
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });
    }

    setCurrentStep({ current: -1, comparing: [], sorted: [], currentLine: -1 });
    setCompleted(true);
    setIsRunning(false);
    onArrayChange([...arr]);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setCurrentArray([...array]);
    setCurrentStep({ current: -1, comparing: [], sorted: [], currentLine: -1 });
    setCompleted(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Insertion Sort</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={insertionSort}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Play size={16} />
              Start
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="flex items-end gap-1 h-80 border-b border-gray-300 p-4">
            {currentArray.map((value, index) => (
              <div
                key={index}
                className={`algorithm-bar ${
                  currentStep.comparing.includes(index)
                    ? "bg-yellow-400"
                    : currentStep.sorted.includes(index)
                    ? "bg-green-400"
                    : index === currentStep.current
                    ? "bg-red-400"
                    : completed
                    ? "bg-green-400"
                    : "bg-blue-400"
                }`}
                style={{
                  height: `${value}px`,
                  width: `${Math.max(800 / currentArray.length - 2, 20)}px`,
                  minWidth: "20px",
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Pseudo Code:</h4>
          <div className="font-mono text-sm space-y-1">
            {pseudoCode.map((line, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentStep.currentLine === index
                    ? "bg-yellow-200 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm">
            <p>
              <strong>Current Status:</strong>
            </p>
            <p>i = {currentStep.current >= 0 ? currentStep.current : "N/A"}</p>
            {currentStep.current >= 0 && (
              <p>key = {currentArray[currentStep.current]}</p>
            )}
            {currentStep.comparing.length > 0 && (
              <p>Comparing positions: {currentStep.comparing.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">How Insertion Sort Works:</h4>
        <ul className="text-sm space-y-1">
          <li>• Build sorted array one element at a time</li>
          <li>• Insert each element into correct position</li>
          <li>• Shift elements as needed</li>
          <li>• Time Complexity: O(n²)</li>
          <li>• Space Complexity: O(1)</li>
        </ul>
      </div>
    </div>
  );
};

// Selection Sort Component
const SelectionSort = ({ array, onArrayChange, speed }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState({
    current: -1,
    min: -1,
    comparing: [],
    sorted: [],
    currentLine: -1,
  });
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef(null);

  const pseudoCode = [
    "for i = 0 to n-2:",
    "    min_idx = i",
    "    for j = i+1 to n-1:",
    "        if arr[j] < arr[min_idx]:",
    "            min_idx = j",
    "    swap arr[i] and arr[min_idx]",
  ];

  const selectionSort = async () => {
    setIsRunning(true);
    setCompleted(false);
    const arr = [...array];
    const sorted = [];

    for (let i = 0; i < arr.length - 1; i++) {
      setCurrentStep({
        current: i,
        min: i,
        comparing: [i],
        sorted: [...sorted],
        currentLine: 0,
      });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      let minIdx = i;
      setCurrentStep({
        current: i,
        min: minIdx,
        comparing: [i],
        sorted: [...sorted],
        currentLine: 1,
      });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      for (let j = i + 1; j < arr.length; j++) {
        setCurrentStep({
          current: i,
          min: minIdx,
          comparing: [j, minIdx],
          sorted: [...sorted],
          currentLine: 2,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        setCurrentStep({
          current: i,
          min: minIdx,
          comparing: [j, minIdx],
          sorted: [...sorted],
          currentLine: 3,
        });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        if (arr[j] < arr[minIdx]) {
          setCurrentStep({
            current: i,
            min: j,
            comparing: [j, minIdx],
            sorted: [...sorted],
            currentLine: 4,
          });
          minIdx = j;
          await new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, speed);
          });
        }
      }

      if (minIdx !== i) {
        setCurrentStep({
          current: i,
          min: minIdx,
          comparing: [i, minIdx],
          sorted: [...sorted],
          currentLine: 5,
        });
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setCurrentArray([...arr]);
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });
      }

      sorted.push(i);
      setCurrentStep({
        current: i,
        min: -1,
        comparing: [],
        sorted: [...sorted],
        currentLine: -1,
      });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });
    }

    sorted.push(arr.length - 1);
    setCurrentStep({
      current: -1,
      min: -1,
      comparing: [],
      sorted: [...sorted],
      currentLine: -1,
    });
    setCompleted(true);
    setIsRunning(false);
    onArrayChange([...arr]);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setCurrentArray([...array]);
    setCurrentStep({
      current: -1,
      min: -1,
      comparing: [],
      sorted: [],
      currentLine: -1,
    });
    setCompleted(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Selection Sort</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={selectionSort}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Play size={16} />
              Start
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="flex items-end gap-1 h-80 border-b border-gray-300 p-4">
            {currentArray.map((value, index) => (
              <div
                key={index}
                className={`algorithm-bar ${
                  currentStep.comparing.includes(index)
                    ? "bg-yellow-400"
                    : index === currentStep.min
                    ? "bg-orange-400"
                    : currentStep.sorted.includes(index)
                    ? "bg-green-400"
                    : index === currentStep.current
                    ? "bg-red-400"
                    : completed
                    ? "bg-green-400"
                    : "bg-blue-400"
                }`}
                style={{
                  height: `${value}px`,
                  width: `${Math.max(800 / currentArray.length - 2, 20)}px`,
                  minWidth: "20px",
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Pseudo Code:</h4>
          <div className="font-mono text-sm space-y-1">
            {pseudoCode.map((line, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentStep.currentLine === index
                    ? "bg-yellow-200 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm">
            <p>
              <strong>Current Status:</strong>
            </p>
            <p>i = {currentStep.current >= 0 ? currentStep.current : "N/A"}</p>
            <p>min_idx = {currentStep.min >= 0 ? currentStep.min : "N/A"}</p>
            {currentStep.min >= 0 && (
              <p>min_value = {currentArray[currentStep.min]}</p>
            )}
            {currentStep.comparing.length > 0 && (
              <p>Comparing positions: {currentStep.comparing.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">How Selection Sort Works:</h4>
        <ul className="text-sm space-y-1">
          <li>• Find minimum element in unsorted portion</li>
          <li>• Swap with first unsorted element</li>
          <li>• Repeat until array is sorted</li>
          <li>• Time Complexity: O(n²)</li>
          <li>• Space Complexity: O(1)</li>
        </ul>
      </div>
    </div>
  );
};

// Linear Search Component
const LinearSearch = ({ array, speed }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [isRunning, setIsRunning] = useState(false);
  const [target, setTarget] = useState("");
  const [currentStep, setCurrentStep] = useState({
    current: -1,
    found: -1,
    currentLine: -1,
  });
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState("");
  const timeoutRef = useRef(null);

  const pseudoCode = [
    "for i = 0 to n-1:",
    "    if arr[i] == target:",
    "        return i",
    "return -1 (not found)",
  ];

  const linearSearch = async () => {
    if (!target) return;

    setIsRunning(true);
    setCompleted(false);
    setResult("");
    const targetNum = parseInt(target);

    for (let i = 0; i < currentArray.length; i++) {
      setCurrentStep({ current: i, found: -1, currentLine: 0 });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      setCurrentStep({ current: i, found: -1, currentLine: 1 });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      if (currentArray[i] === targetNum) {
        setCurrentStep({ current: i, found: i, currentLine: 2 });
        setResult(`Found ${targetNum} at index ${i}`);
        setCompleted(true);
        setIsRunning(false);
        return;
      }
    }

    setCurrentStep({ current: -1, found: -1, currentLine: 3 });
    setResult(`${targetNum} not found in array`);
    setCompleted(true);
    setIsRunning(false);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setCurrentStep({ current: -1, found: -1, currentLine: -1 });
    setCompleted(false);
    setResult("");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Linear Search</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter target value"
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={linearSearch}
              disabled={isRunning || !target}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Play size={16} />
              Search
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {result && (
            <div
              className={`p-3 rounded mb-4 ${
                result.includes("Found")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result}
            </div>
          )}

          <div className="flex items-end gap-1 h-80 border-b border-gray-300 p-4">
            {currentArray.map((value, index) => (
              <div
                key={index}
                className={`algorithm-bar ${
                  index === currentStep.found
                    ? "bg-green-400"
                    : index === currentStep.current
                    ? "bg-yellow-400"
                    : "bg-blue-400"
                }`}
                style={{
                  height: `${value}px`,
                  width: `${Math.max(800 / currentArray.length - 2, 20)}px`,
                  minWidth: "20px",
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Pseudo Code:</h4>
          <div className="font-mono text-sm space-y-1">
            {pseudoCode.map((line, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentStep.currentLine === index
                    ? "bg-yellow-200 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm">
            <p>
              <strong>Current Status:</strong>
            </p>
            <p>target = {target || "N/A"}</p>
            <p>i = {currentStep.current >= 0 ? currentStep.current : "N/A"}</p>
            {currentStep.current >= 0 && (
              <p>
                arr[{currentStep.current}] = {currentArray[currentStep.current]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">How Linear Search Works:</h4>
        <ul className="text-sm space-y-1">
          <li>• Check each element sequentially</li>
          <li>• Return index if element found</li>
          <li>• Continue until end if not found</li>
          <li>• Time Complexity: O(n)</li>
          <li>• Space Complexity: O(1)</li>
        </ul>
      </div>
    </div>
  );
};

// Binary Search Component
const BinarySearch = ({ array, speed }) => {
  const [sortedArray, setSortedArray] = useState(
    [...array].sort((a, b) => a - b)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [target, setTarget] = useState("");
  const [currentStep, setCurrentStep] = useState({
    left: -1,
    right: -1,
    mid: -1,
    found: -1,
    currentLine: -1,
  });
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState("");
  const timeoutRef = useRef(null);

  const pseudoCode = [
    "left = 0, right = n-1",
    "while left <= right:",
    "    mid = (left + right) / 2",
    "    if arr[mid] == target:",
    "        return mid",
    "    else if arr[mid] < target:",
    "        left = mid + 1",
    "    else:",
    "        right = mid - 1",
    "return -1 (not found)",
  ];

  useEffect(() => {
    setSortedArray([...array].sort((a, b) => a - b));
  }, [array]);

  const binarySearch = async () => {
    if (!target) return;

    setIsRunning(true);
    setCompleted(false);
    setResult("");
    const targetNum = parseInt(target);
    let left = 0;
    let right = sortedArray.length - 1;

    setCurrentStep({ left, right, mid: -1, found: -1, currentLine: 0 });
    await new Promise((resolve) => {
      timeoutRef.current = setTimeout(resolve, speed);
    });

    while (left <= right) {
      setCurrentStep({ left, right, mid: -1, found: -1, currentLine: 1 });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      const mid = Math.floor((left + right) / 2);
      setCurrentStep({ left, right, mid, found: -1, currentLine: 2 });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      setCurrentStep({ left, right, mid, found: -1, currentLine: 3 });
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });

      if (sortedArray[mid] === targetNum) {
        setCurrentStep({ left, right, mid, found: mid, currentLine: 4 });
        setResult(`Found ${targetNum} at index ${mid}`);
        setCompleted(true);
        setIsRunning(false);
        return;
      } else if (sortedArray[mid] < targetNum) {
        setCurrentStep({ left, right, mid, found: -1, currentLine: 5 });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });
        setCurrentStep({ left, right, mid, found: -1, currentLine: 6 });
        left = mid + 1;
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });
      } else {
        setCurrentStep({ left, right, mid, found: -1, currentLine: 7 });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });
        setCurrentStep({ left, right, mid, found: -1, currentLine: 8 });
        right = mid - 1;
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });
      }
    }

    setCurrentStep({ left: -1, right: -1, mid: -1, found: -1, currentLine: 9 });
    setResult(`${targetNum} not found in array`);
    setCompleted(true);
    setIsRunning(false);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setCurrentStep({
      left: -1,
      right: -1,
      mid: -1,
      found: -1,
      currentLine: -1,
    });
    setCompleted(false);
    setResult("");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Binary Search</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter target value"
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={binarySearch}
              disabled={isRunning || !target}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Play size={16} />
              Search
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {result && (
            <div
              className={`p-3 rounded mb-4 ${
                result.includes("Found")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result}
            </div>
          )}

          <div className="flex items-end gap-1 h-80 border-b border-gray-300 p-4">
            {sortedArray.map((value, index) => (
              <div
                key={index}
                className={`algorithm-bar ${
                  index === currentStep.found
                    ? "bg-green-400"
                    : index === currentStep.mid
                    ? "bg-yellow-400"
                    : index >= currentStep.left &&
                      index <= currentStep.right &&
                      currentStep.left !== -1
                    ? "bg-orange-200"
                    : "bg-blue-400"
                }`}
                style={{
                  height: `${value}px`,
                  width: `${Math.max(800 / sortedArray.length - 2, 20)}px`,
                  minWidth: "20px",
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Pseudo Code:</h4>
          <div className="font-mono text-sm space-y-1">
            {pseudoCode.map((line, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentStep.currentLine === index
                    ? "bg-yellow-200 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm">
            <p>
              <strong>Current Status:</strong>
            </p>
            <p>target = {target || "N/A"}</p>
            <p>left = {currentStep.left >= 0 ? currentStep.left : "N/A"}</p>
            <p>right = {currentStep.right >= 0 ? currentStep.right : "N/A"}</p>
            <p>mid = {currentStep.mid >= 0 ? currentStep.mid : "N/A"}</p>
            {currentStep.mid >= 0 && (
              <p>
                arr[{currentStep.mid}] = {sortedArray[currentStep.mid]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">How Binary Search Works:</h4>
        <ul className="text-sm space-y-1">
          <li>• Array must be sorted first</li>
          <li>• Compare target with middle element</li>
          <li>• Eliminate half of search space</li>
          <li>• Repeat until found or exhausted</li>
          <li>• Time Complexity: O(log n)</li>
          <li>• Space Complexity: O(1)</li>
        </ul>
      </div>
    </div>
  );
};

// Merge Sort Component
const MergeSort = ({ array, onArrayChange, speed }) => {
  const [currentArray, setCurrentArray] = useState([...array]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState({
    merging: [],
    sorted: [],
    currentLine: -1,
  });
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef(null);

  const pseudoCode = [
    "if left < right:",
    "    mid = (left + right) / 2",
    "    mergeSort(arr, left, mid)",
    "    mergeSort(arr, mid+1, right)",
    "    merge(arr, left, mid, right)",
  ];

  const mergeSort = async () => {
    setIsRunning(true);
    setCompleted(false);
    const arr = [...array];

    const merge = async (arr, left, mid, right) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0,
        j = 0,
        k = left;

      while (i < leftArr.length && j < rightArr.length) {
        setCurrentStep({
          merging: Array.from(
            { length: right - left + 1 },
            (_, idx) => left + idx
          ),
          sorted: [],
          currentLine: 4,
        });
        setCurrentArray([...arr]);
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
      }

      setCurrentArray([...arr]);
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, speed);
      });
    };

    const mergeSortRecursive = async (arr, left, right) => {
      if (left < right) {
        setCurrentStep({ merging: [], sorted: [], currentLine: 0 });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        const mid = Math.floor((left + right) / 2);
        setCurrentStep({ merging: [], sorted: [], currentLine: 1 });
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, speed);
        });

        setCurrentStep({ merging: [], sorted: [], currentLine: 2 });
        await mergeSortRecursive(arr, left, mid);

        setCurrentStep({ merging: [], sorted: [], currentLine: 3 });
        await mergeSortRecursive(arr, mid + 1, right);

        await merge(arr, left, mid, right);
      }
    };

    await mergeSortRecursive(arr, 0, arr.length - 1);

    setCurrentStep({ merging: [], sorted: [], currentLine: -1 });
    setCompleted(true);
    setIsRunning(false);
    onArrayChange([...arr]);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setCurrentArray([...array]);
    setCurrentStep({ merging: [], sorted: [], currentLine: -1 });
    setCompleted(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Merge Sort</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={mergeSort}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Play size={16} />
              Start
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="flex items-end gap-1 h-80 border-b border-gray-300 p-4">
            {currentArray.map((value, index) => (
              <div
                key={index}
                className={`algorithm-bar ${
                  currentStep.merging.includes(index)
                    ? "bg-yellow-400"
                    : completed
                    ? "bg-green-400"
                    : "bg-blue-400"
                }`}
                style={{
                  height: `${value}px`,
                  width: `${Math.max(800 / currentArray.length - 2, 20)}px`,
                  minWidth: "20px",
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-3">Pseudo Code:</h4>
          <div className="font-mono text-sm space-y-1">
            {pseudoCode.map((line, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentStep.currentLine === index
                    ? "bg-yellow-200 border-l-4 border-yellow-500"
                    : "bg-white"
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm">
            <p>
              <strong>Current Status:</strong>
            </p>
            <p>
              Operation: {currentStep.currentLine >= 0 ? "Executing" : "Idle"}
            </p>
            {currentStep.merging.length > 0 && (
              <p>Merging indices: {currentStep.merging.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">How Merge Sort Works:</h4>
        <ul className="text-sm space-y-1">
          <li>• Divide array into two halves</li>
          <li>• Recursively sort both halves</li>
          <li>• Merge sorted halves together</li>
          <li>• Time Complexity: O(n log n)</li>
          <li>• Space Complexity: O(n)</li>
        </ul>
      </div>
    </div>
  );
};

// Main App Component
const AlgorithmVisualizer = () => {
  const [array, setArray] = useState(generateRandomArray(20));
  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(20);
  const [activeTab, setActiveTab] = useState("bubble");

  const generateNewArray = () => {
    setArray(generateRandomArray(arraySize));
  };

  const algorithms = {
    bubble: { name: "Bubble Sort", component: BubbleSort },
    insertion: { name: "Insertion Sort", component: InsertionSort },
    selection: { name: "Selection Sort", component: SelectionSort },
    linear: { name: "Linear Search", component: LinearSearch },
    binary: { name: "Binary Search", component: BinarySearch },
    merge: { name: "Merge Sort", component: MergeSort },
  };

  const ActiveComponent = algorithms[activeTab].component;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Algorithm Visualizer
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Settings size={20} />
                <label className="text-sm font-medium">Array Size:</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={arraySize}
                  onChange={(e) => setArraySize(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">{arraySize}</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Speed:</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">{speed}ms</span>
              </div>
            </div>

            <button
              onClick={generateNewArray}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Generate New Array
            </button>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap border-b">
            {Object.entries(algorithms).map(([key, algo]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === key
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Algorithm Component */}
        <ActiveComponent array={array} onArrayChange={setArray} speed={speed} />

        {/* Info Panel */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold">Color Legend & Tips</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Color Meanings:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-sm">Unsorted elements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm">Currently comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span className="text-sm">
                    Current element / Being swapped
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span className="text-sm">
                    Minimum element (Selection Sort)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-sm">
                    Sorted elements / Found element
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-200 rounded"></div>
                  <span className="text-sm">Search range (Binary Search)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Tips:</h4>
              <ul className="text-sm space-y-1">
                <li>• Adjust speed to better understand each step</li>
                <li>
                  • Try different array sizes to see performance differences
                </li>
                <li>• Binary search requires a sorted array</li>
                <li>• Watch how divide-and-conquer works in merge sort</li>
                <li>• Compare time complexities between algorithms</li>
                <li>• Reset anytime to start over with the same array</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Algorithm Comparison */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Algorithm Comparison</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Algorithm</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Best Case</th>
                  <th className="text-left p-2">Average Case</th>
                  <th className="text-left p-2">Worst Case</th>
                  <th className="text-left p-2">Space</th>
                  <th className="text-left p-2">Stable</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Bubble Sort</td>
                  <td className="p-2">Sorting</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Insertion Sort</td>
                  <td className="p-2">Sorting</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Selection Sort</td>
                  <td className="p-2">Sorting</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">No</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Merge Sort</td>
                  <td className="p-2">Sorting</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Linear Search</td>
                  <td className="p-2">Searching</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">N/A</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Binary Search</td>
                  <td className="p-2">Searching</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">O(log n)</td>
                  <td className="p-2">O(log n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
