import Image from 'next/image';
import React from 'react';


type NotificationType = {
  notification: string;
  severity: string;
};

type NotificationsProps = {
  notifications: NotificationType[];
};

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  return (
    <div className='flex gap-2 flex-col'>
      {notifications.length > 0 &&
        notifications.map((item, index) => (
          <div
            key={index}
            className="group relative w-full bg-[#F8BD00] py-2 px-5 flex justify-between items-center rounded-md flex-row overflow-hidden hover:cursor-pointer"
          >
            <div className="flex gap-3 items-center">
              <div className="w-fit h-fit">
                <Image
                  src={`/icons/${item.severity == 'casual' ? 'alert.png' : 'warning.png'}`}
                  width={20}
                  height={20}
                  alt="alert icon"
                />
              </div>

              <p className="font-bold">{item.notification}</p>
            </div>

            <div className="w-fit h-fit hover:cursor-pointer">
              <Image
                src="/icons/close.png"
                height={15}
                width={15}
                alt="close icon"
              />
            </div>

            <div className="w-[10px] absolute top-0 bottom-0 left-0 bg-black"></div>
          </div>
        ))}
    </div>
  );
};

export default Notifications;
