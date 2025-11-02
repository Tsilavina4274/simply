import { useState, useEffect } from "react";

export default function DateTabs() {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date();
    const arr: string[] = [];

    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      if (i === 0) arr.push("Today");
      else if (i === 1) arr.push("Tomorrow");
      else {
        arr.push(
          d.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
          })
        );
      }
    }
    setDates(arr);
  }, []);

  return (
    <div className="flex space-x-4 italic text-sm text-gray-600 p-2 rounded">
      {dates.map((item, i) => (
        <span key={i} className="cursor-pointer hover:text-gray-300">
          {item}
        </span>
      ))}
    </div>
  );
}
