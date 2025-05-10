import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export function CounselorView() {
  const [counselorInput, setCounselorInput] = useState("");
  const [counselorResponse, setCounselorResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("blue");
  const getCounseling = useAction(api.counselor.getCounselingResponse);

  async function handleCounselorSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!counselorInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await getCounseling({
        userMessage: counselorInput,
        color: selectedColor,
        emotions: ["Anxiety", "Stress"],
      });
      setCounselorResponse(response);
    } catch (error) {
      console.error("Counseling error:", error);
    }
    setIsLoading(false);
    setCounselorInput("");
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Choose Your Color</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Blue", value: "blue", desc: "Calming, peaceful" },
            { name: "Green", value: "green", desc: "Growth, balance" },
            { name: "Yellow", value: "yellow", desc: "Joy, energy" },
            { name: "Purple", value: "purple", desc: "Creativity, wisdom" },
            { name: "Red", value: "red", desc: "Passion, strength" },
            { name: "Orange", value: "orange", desc: "Enthusiasm, adventure" },
            { name: "Pink", value: "pink", desc: "Love, compassion" },
            { name: "Teal", value: "teal", desc: "Clarity, communication" },
          ].map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`aspect-square rounded-lg p-4 text-white transition-transform ${
                selectedColor === color.value ? "scale-105 ring-2 ring-offset-2" : ""
              }`}
              style={{ backgroundColor: `var(--${color.value}-400, ${color.value})` }}
            >
              <p className="font-medium">{color.name}</p>
              <p className="text-sm mt-1">{color.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Color Therapy Counselor</h3>
        <form onSubmit={handleCounselorSubmit} className="space-y-4">
          <textarea
            value={counselorInput}
            onChange={(e) => setCounselorInput(e.target.value)}
            placeholder="Share how you're feeling..."
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !counselorInput.trim()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
          >
            {isLoading ? "Thinking..." : "Get Guidance"}
          </button>
        </form>
        {counselorResponse && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{counselorResponse}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Color Therapy Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">What is Color Therapy?</h4>
            <p className="text-gray-600">
              Color therapy, or chromotherapy, is the practice of using colors and their frequencies 
              to promote physical and emotional well-being. Each color carries unique vibrations 
              that can influence our mood and energy.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">How to Use This Space</h4>
            <p className="text-gray-600">
              1. Select a color that resonates with your current state
              2. Share your thoughts and feelings in the counselor
              3. Receive personalized guidance combining color therapy and emotional support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
