import React from 'react';

// 1. Define Props Interface
interface AccountPreferencesCardProps {
    title: string;
    socialLinks?: boolean;
}

interface ToggleSwitchProps {
    label: string;
}

// Helper Components (Typed with React.FC)
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label }) => (
    <div className="flex justify-between items-center py-2">
        <span>{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            {/* The input element is typed as a standard HTML input element */}
            <input type="checkbox" className="sr-only peer" defaultChecked/> 
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

interface SocialIconProps {
    icon: React.ReactNode;
    color: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, color }) => (
    <a href="#" className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-xl ${color}`}>
        {icon}
    </a>
);


// 2. AccountPreferencesCard Component
const AccountPreferencesCard: React.FC<AccountPreferencesCardProps> = ({ title, socialLinks = false }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>

            {socialLinks ? (
                // Social Media Links Section
                <div className="flex space-x-4 justify-center mt-6">
                    <SocialIcon icon="f" color="bg-blue-700 hover:bg-blue-600" />
                    <SocialIcon icon="🖼️" color="bg-pink-600 hover:bg-pink-500" />
                    <SocialIcon icon="💬" color="bg-green-600 hover:bg-green-500" />
                </div>
            ) : (
                // Toggle Switches Section
                <div className="space-y-2">
                    <ToggleSwitch label="Dark mode" />
                    <ToggleSwitch label="Email notification" />
                    <ToggleSwitch label="Notification" />
                </div>
            )}
        </div>
    );
};

export default AccountPreferencesCard;