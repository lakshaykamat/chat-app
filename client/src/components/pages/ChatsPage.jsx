import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from "axios";

const fetcher = url => axios.get(url).then(res => res.data);

const ChatsPage = () => {
    const [chats, setChats] = useState([]);
    const { data, error, isLoading } = useSWR("http://127.0.0.1:5000/api/chat", fetcher);

    useEffect(() => {
        if (data) {
            setChats(data);
        }
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div>
            <div className='text-3xl'>Chats</div>
            <div>
                {chats.map(item => (
                    <div key={item._id}>{item.chatName}</div>
                ))}
            </div>
        </div>
    );
};

export default ChatsPage;
