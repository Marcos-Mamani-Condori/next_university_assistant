import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import currentOrigin from '@/libs/config';
import Image from 'next/image';
import user_icon from '@/public/default.png';
const UserImage = () => {
    const { data: session } = useSession();  
    const [imageSrc, setImageSrc] = useState(user_icon); 

    useEffect(() => {
        const fetchImage = async () => {
            if (session && session.user) {
                const userId = session.user.id;
                const imageUrl = `${currentOrigin}/uploads/${userId}.webp?${Date.now()}`;

                try {
                    const response = await fetch(imageUrl, { method: 'HEAD' });
                    if (response.ok) {
                        setImageSrc(imageUrl);  
                    } else {
                        setImageSrc(`${currentOrigin}/uploads/default.png`);  
                    }
                } catch (error) {
                    setImageSrc(`${currentOrigin}/uploads/default.png`);  
                }
            } else {
                setImageSrc(`${currentOrigin}/uploads/default.png`);
            }
        };

        fetchImage();  
    }, [session]); 

    return <Image src={imageSrc} alt="User" width={64} height={64} className="rounded-full" />;
};

export default UserImage;
