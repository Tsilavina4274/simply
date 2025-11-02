import AlertsAndRecs from "../components/Alert";
import MediaPlanning from "../components/MediaPlaning";

import ModeratorActivity from "../components/Moderator";
import Navbar from "../components/navbar";
import PerformanceStats from "../components/PerformanceStat";
import Sidebar from "../components/sidebar";
import UrgentMessaging from "../components/UrgentMessaging";
import { useEffect, useState } from 'react';
import { useUsers, useFans, useContent, useImages } from '../context/DataContext';

const CreateursPage = () => {
    const { users } = useUsers();
    const { fans } = useFans();
    const { content } = useContent();
    const { images } = useImages();

    const [counts, setCounts] = useState({ users: 0, fans: 0, contenu: 0, images: 0 });

    useEffect(() => {
        setCounts({
            users: Array.isArray(users) ? users.length : 0,
            fans: Array.isArray(fans) ? fans.length : 0,
            contenu: Array.isArray(content) ? content.length : 0,
            images: Array.isArray(images) ? images.length : 0,
        });
    }, [users, fans, content, images]);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
               <div className="flex-1 overflow-auto bg-gray-900">
                    {/* Overview using real API counts */}
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div className="glassmorphism rounded-xl p-4 border border-gray-700/50">
                                <p className="text-xs text-gray-400 uppercase">Employés</p>
                                <p className="text-2xl font-bold text-white">{counts.users}</p>
                            </div>
                            <div className="glassmorphism rounded-xl p-4 border border-gray-700/50">
                                <p className="text-xs text-gray-400 uppercase">Fans</p>
                                <p className="text-2xl font-bold text-white">{counts.fans}</p>
                            </div>
                            <div className="glassmorphism rounded-xl p-4 border border-gray-700/50">
                                <p className="text-xs text-gray-400 uppercase">Contenu</p>
                                <p className="text-2xl font-bold text-white">{counts.contenu}</p>
                            </div>
                            <div className="glassmorphism rounded-xl p-4 border border-gray-700/50">
                                <p className="text-xs text-gray-400 uppercase">Images</p>
                                <p className="text-2xl font-bold text-white">{counts.images}</p>
                            </div>
                        </div>
                    </div>

                    <PerformanceStats />
                    <UrgentMessaging />
                    <MediaPlanning />
                    <ModeratorActivity />
                    <AlertsAndRecs />
                </div>
            </div>
        </div>
    );
};

export default CreateursPage;
