import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { CopingToolkit } from "./CopingToolkit";

const COLORS = {
  red: "#dc2626",
  coral: "#f97316",
  orange: "#f59e0b",
  amber: "#d97706",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
};

export function InteractiveView() {
  const stats = useQuery(api.prompts.getEmotionStats);
  const [currentPrompt, setCurrentPrompt] = useState<{ text: string; type: string } | null>(null);
  const randomPrompt = useQuery(api.prompts.getRandomPrompt, 
    currentPrompt ? { currentPrompt: currentPrompt.text } : {}
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [colorInsight, setColorInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const getColorInsight = useAction(api.counselor.getColorInsight);

  useEffect(() => {
    if (randomPrompt && !currentPrompt) {
      setCurrentPrompt(randomPrompt);
    }
  }, [randomPrompt, currentPrompt]);

  const handleNewPrompt = () => {
    if (randomPrompt && randomPrompt.text !== currentPrompt?.text) {
      setCurrentPrompt(randomPrompt);
    }
  };

  const handleColorSelect = async (color: string) => {
    setSelectedColor(color);
    setIsLoading(true);
    try {
      const insight = await getColorInsight({ color });
      setColorInsight(insight);
    } catch (error) {
      console.error("Error getting color insight:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Reflection Prompt */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Today's Reflection</h3>
        <p className="text-lg italic text-gray-700">{currentPrompt?.text}</p>
        <button
          onClick={handleNewPrompt}
          className="mt-4 px-4 py-2 bg-white/50 rounded-full hover:bg-white/70 transition-colors"
        >
          New Prompt
        </button>
      </div>

      {/* Color Palette */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Color Therapy Palette</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(COLORS).map(([name, hex]) => (
            <button
              key={name}
              onClick={() => handleColorSelect(name)}
              className={`aspect-square rounded-lg transition-transform hover:scale-105 ${
                selectedColor === name ? 'ring-2 ring-offset-2 scale-105' : ''
              }`}
              style={{ backgroundColor: hex }}
              title={name}
            />
          ))}
        </div>
        
        {isLoading ? (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : colorInsight && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{colorInsight}</p>
          </div>
        )}
      </div>

      {/* Emotion Color Wheel */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Your Emotional Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats?.map((stat) => (
            <div
              key={stat.emotion}
              className="p-4 rounded-lg"
              style={{
                background: `linear-gradient(45deg, ${stat.colors.join(', ')})`,
              }}
            >
              <div className="bg-white/90 p-2 rounded">
                <h4 className="font-medium">{stat.emotion}</h4>
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    {stat.count} {stat.count === 1 ? 'entry' : 'entries'}
                  </div>
                  <div className="flex gap-1">
                    {stat.colors.map((color) => (
                      <div
                        key={color}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coping Toolkit */}
      <CopingToolkit selectedColor={selectedColor} />

      {/* Mood Patterns */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Your Mood Patterns</h3>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }).map((_, i) => {
            const randomColor = stats?.[Math.floor(Math.random() * (stats.length || 1))]?.colors[0] || '#e5e7eb';
            return (
              <div
                key={i}
                className="aspect-square rounded"
                style={{ backgroundColor: randomColor }}
                title={`Day ${i + 1}`}
              />
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Your emotional journey over the past 28 days
        </div>
      </div>
    </div>
  );
}
