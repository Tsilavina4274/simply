import { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="flex items-center bg-neutral-900 text-white px-4 py-2 rounded-full text-sm gap-2 mb-1">
      <Calendar size={16} className="text-gray-300" />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd.MM.yyyy"
        placeholderText="Choisir une date"
        className="bg-transparent outline-none text-white cursor-pointer"
        calendarStartDay={1}
      />
    </div>
  );
}
