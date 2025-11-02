import React from 'react';

// 1. Interface pour les props de InputField
interface InputFieldProps {
    label: string;
}

// 2. Composant réutilisable pour un champ de saisie
const InputField: React.FC<InputFieldProps> = ({ label }) => (
    <div className="relative mb-4">
        <input 
            type="text" 
            placeholder={label} 
            // Tailwind classes pour le style du champ
            className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
        />
        {/* Un chevron de dropdown pourrait être ajouté ici si l'input est un select/dropdown */}
        {/* Par exemple : <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔽</span> */}
    </div>
);


// 3. Composant PersonalInformationCard
const PersonalInformationCard: React.FC = () => {
    return (
        // Conteneur de la carte
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Personnal information</h3>
           
            {/* Grille pour les champs (2 colonnes sur écrans moyens/grands) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full name" />
                <InputField label="Full name" />
                <InputField label="Email adress" />
                <InputField label="Email adress" />
                <InputField label="Phone number" />
                <InputField label="Phone number" />
                <InputField label="Location" />
                <InputField label="Location" />
                {/* Note : Il y a une redondance "Phone number" dans l'image originale */}
                <InputField label="Phone number" />
                <InputField label="Phone number" />
            </div>

            {/* Bouton "Changes" */}
            <button className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200">
                Changes
            </button>
        </div>
    );
};

export default PersonalInformationCard;