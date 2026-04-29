'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const InboundHandleText = () => {

    const [inboundHandle, setInboundHandle] = useState('');
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            fetchInboundHandle();
        }
    }, [status]);

    const fetchInboundHandle = async () => {
        try {
            const response = await fetch('/api/user/inbound-handle');
            const data = await response.json();
            setInboundHandle(data.inboundHandle);
        } catch (error) {
            console.error('Error fetching inbound handle:', error);
        }
    };

    return (
        <div className="inbound-email-container">
            <p className="inbound-email-address">{inboundHandle}@reermi.resend.app</p>
            <p className="inbound-email-description">Send your receipts images to this email address and we will automatically extract the data and save it to your account.</p>
        </div>
    );
}

export default InboundHandleText;
