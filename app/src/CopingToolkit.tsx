import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";
import { BreathingExercise, GroundingExercise, BodyScan } from "./QuickTechniques";

export function CopingToolkit({ selectedColor }: { selectedColor?: string }) {
  const strategies = useQuery(api.strategies.list) || [];
  const colorStrategies = useQuery(
    api.strategies.listByColor,
    selectedColor ? { color: selectedColor } : "skip"
  );
  const markAsUsed = useMutation(api.strategies.markAsUsed);
  const [activeStrategy, setActiveStrategy] = useState<Id<"copingStrategies"> | null>(null);
  const [activeExercise, setActiveExercise] = useState<"breathing" | "grounding" | "bodyScan" | null>(null);
  const [activeColorTherapy, setActiveColorTherapy] = useState<string | null>(null);

  async function handleStrategyClick(strategyId: Id<"copingStrategies">) {
    setActiveStrategy(strategyId);
    try {
      await markAsUsed({ strategyId });
      toast.success("Strategy marked as completed!");
    } catch (error) {
      console.error("Error marking strategy:", error);
      toast.error("Failed to mark strategy as completed");
    }
    setTimeout(() => setActiveStrategy(null), 2000);
  }

  const handleColorTherapy = (color: string, name: string, desc: string) => {
    setActiveColorTherapy(color);
    
    // Show initial selection feedback
    toast.success(`Engaging with ${name}'s energy...`);
    
    // Start color therapy session
    setTimeout(() => {
      toast.info(`Feel the ${desc.toLowerCase()} energy of ${name}...`, {
        duration: 5000,
      });
    }, 1000);

    // Cleanup after session
    setTimeout(() => {
      setActiveColorTherapy(null);
      toast.success(`${name} therapy session complete`);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Your Coping Toolkit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(selectedColor ? colorStrategies : strategies)?.map((strategy) => (
            <div
              key={strategy._id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                activeStrategy === strategy._id ? 'ring-2 ring-indigo-500' : ''
              }`}
              style={{ borderColor: strategy.color }}
              onClick={() => handleStrategyClick(strategy._id)}
            >
              <h4 className="font-medium text-lg">{strategy.title}</h4>
              <p className="text-gray-600 mt-2">{strategy.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {strategy.emotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Used {strategy.usageCount || 0} times
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Quick Techniques</h3>
        {activeExercise === "breathing" ? (
          <BreathingExercise />
        ) : activeExercise === "grounding" ? (
          <GroundingExercise />
        ) : activeExercise === "bodyScan" ? (
          <BodyScan />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button 
              className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left"
              onClick={() => setActiveExercise("breathing")}
            >
              <h4 className="font-medium">Deep Breathing</h4>
              <p className="text-sm text-gray-600 mt-2">
                Breathe in for 4, hold for 4, out for 4
              </p>
            </button>
            <button 
              className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-left"
              onClick={() => setActiveExercise("grounding")}
            >
              <h4 className="font-medium">5-4-3-2-1 Grounding</h4>
              <p className="text-sm text-gray-600 mt-2">
                Name 5 things you see, 4 you feel...
              </p>
            </button>
            <button 
              className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-left"
              onClick={() => setActiveExercise("bodyScan")}
            >
              <h4 className="font-medium">Body Scan</h4>
              <p className="text-sm text-gray-600 mt-2">
                Start at your toes and move up...
              </p>
            </button>
          </div>
        )}
        {activeExercise && (
          <button
            onClick={() => setActiveExercise(null)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Techniques
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Color Therapy</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Blue", desc: "Calming, peaceful", bg: "bg-blue-400" },
            { name: "Green", desc: "Growth, balance", bg: "bg-green-400" },
            { name: "Yellow", desc: "Joy, energy", bg: "bg-yellow-400" },
            { name: "Purple", desc: "Creativity, wisdom", bg: "bg-purple-400" },
          ].map((color) => (
            <button
              key={color.name}
              className={`aspect-square rounded-lg ${color.bg} p-4 text-white transform transition-all duration-300 hover:scale-105 ${
                activeColorTherapy === color.name.toLowerCase() ? 'ring-4 ring-white ring-opacity-50 scale-105' : ''
              }`}
              onClick={() => handleColorTherapy(color.name.toLowerCase(), color.name, color.desc)}
            >
              <p className="font-medium">{color.name}</p>
              <p className="text-sm mt-1">{color.desc}</p>
              {activeColorTherapy === color.name.toLowerCase() && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg" />
              )}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Click a color to start a brief therapeutic session
        </p>
      </div>
    </div>
  );
}
