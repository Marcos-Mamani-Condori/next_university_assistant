import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import currentOrigin from '@/libs/config';
import Image from 'next/image';

const UserImage = () => {
    const { data: session } = useSession();
    const [imageSrc, setImageSrc] = useState(``);

    useEffect(() => {
        const fetchProfileUrl = async () => {
            if (!session) {
                return;
            }


            try {
                const response = await fetch('/api/getUserProfileUrl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.user.accessToken}`,
                    },
                });


                const data = await response.json();


                if (response.ok && data.profileUrl) {
                    setImageSrc(`${currentOrigin}${data.profileUrl}?${Date.now()}`);
                } else {
                }
            } catch (error) {
                setImageSrc(`${currentOrigin}/uploads/default.png`);
            }
        };

        fetchProfileUrl();
    }, [session]);

    return <Image src={imageSrc} alt="User" width={64} height={64} className="rounded-full" />;
};

export default UserImage;
