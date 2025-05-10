import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#eab308" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Fuchsia", value: "#d946ef" }
];

const EMOTIONS = [
  "Joy", "Anger", "Sadness", "Fear", "Excitement",
  "Anxiety", "Peace", "Confusion", "Hope", "Frustration"
];

export function JournalView() {
  const entries = useQuery(api.journal.list) || [];
  const createEntry = useMutation(api.journal.create);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEntry({
        title,
        content,
        color,
        emotions: selectedEmotions,
        intensity,
      });
      toast.success("Journal entry saved!");
      setTitle("");
      setContent("");
      setSelectedEmotions([]);
      setIntensity(5);
    } catch (error) {
      toast.error("Failed to save entry");
      console.error(error);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Emotional Intensity (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Intense</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                  color === c.value ? 'ring-2 ring-offset-2 scale-110' : ''
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Emotions
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => {
                  setSelectedEmotions((prev) =>
                    prev.includes(emotion)
                      ? prev.filter((e) => e !== emotion)
                      : [...prev, emotion]
                  );
                }}
                className={`px-3 py-1 rounded transition-all ${
                  selectedEmotions.includes(emotion)
                    ? 'bg-indigo-500 text-white scale-105'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title || !content}
          className={`px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 transition-all ${
            isSubmitting ? 'animate-pulse' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            style={{ borderLeft: `4px solid ${entry.color}` }}
          >
            <h3 className="font-bold">{entry.title}</h3>
            <p className="mt-2">{entry.content}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="px-2 py-0.5 bg-gray-100 rounded-full text-sm"
                >
                  {emotion}
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500"
                  style={{ width: `${(entry.intensity || 5) * 10}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">
                Intensity: {entry.intensity || 5}
              </span>
            </div>
            <time className="text-sm text-gray-500 mt-2 block">
              {new Date(entry.createdAt).toLocaleDateString()}
            </time>
          </div>
        ))}
      </div>
    </div>
  );
}
