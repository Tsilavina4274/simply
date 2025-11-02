import React from 'react';

interface InputFieldProps {
  label: string;
  icon: React.ElementType;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  icon: Icon, 
  value = '', 
  onChange,
  disabled = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="group">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
};