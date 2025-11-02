import { Users } from "lucide-react";
import { useState } from "react";

export default function ServerSelectWithIcon() {
  const [selected, setSelected] = useState("Server location");

  return (
    <div className="relative w-60">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="select select-neutral w-full pl-10"
      >
        <option disabled>All creator</option>
        <option>All creator</option>
        <option>Name creator 1</option>
        <option>Name creator 2</option>
      </select>
      <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}
