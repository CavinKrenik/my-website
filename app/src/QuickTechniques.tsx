import { useState, useEffect } from "react";
import { toast } from "sonner";

export function BreathingExercise() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest");
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1;
        
        // Transition to next phase
        switch (phase) {
          case "inhale":
            setPhase("hold");
            return 4;
          case "hold":
            setPhase("exhale");
            return 4;
          case "exhale":
            setPhase("inhale");
            return 4;
          default:
            setPhase("inhale");
            return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  return (
    <div className="text-center p-8 bg-blue-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Deep Breathing</h3>
      {isActive ? (
        <>
          <div className="text-3xl font-bold mb-4">{count}</div>
          <div className="text-lg mb-4">{phase.charAt(0).toUpperCase() + phase.slice(1)}</div>
          <button
            onClick={() => setIsActive(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Stop
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setIsActive(true);
            setPhase("inhale");
            setCount(4);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start
        </button>
      )}
    </div>
  );
}

export function GroundingExercise() {
  const [step, setStep] = useState(0);
  const steps = [
    { count: 5, sense: "see" },
    { count: 4, sense: "feel" },
    { count: 3, sense: "hear" },
    { count: 2, sense: "smell" },
    { count: 1, sense: "taste" },
  ];

  if (step >= steps.length) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Well done!</h3>
        <p className="mb-4">You've completed the grounding exercise.</p>
        <button
          onClick={() => setStep(0)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8 bg-green-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">5-4-3-2-1 Grounding</h3>
      <p className="text-lg mb-4">
        Name {steps[step].count} things you can {steps[step].sense}
      </p>
      <button
        onClick={() => setStep(step + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Next Step
      </button>
    </div>
  );
}

export function BodyScan() {
  const [currentPart, setCurrentPart] = useState(0);
  const bodyParts = [
    "toes", "feet", "ankles", "calves", "knees", "thighs",
    "hips", "lower back", "upper back", "chest", "shoulders",
    "arms", "hands", "neck", "face"
  ];

  if (currentPart >= bodyParts.length) {
    return (
      <div className="text-center p-8 bg-purple-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Scan Complete</h3>
        <p className="mb-4">You've completed the body scan.</p>
        <button
          onClick={() => setCurrentPart(0)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Start Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8 bg-purple-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Body Scan</h3>
      <p className="text-lg mb-4">
        Focus on your {bodyParts[currentPart]}. Notice any sensations.
      </p>
      <button
        onClick={() => setCurrentPart(currentPart + 1)}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Move Up
      </button>
    </div>
  );
}
