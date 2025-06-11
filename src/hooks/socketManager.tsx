import { createContext, useState, useMemo, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext({
  socket: null,
  connectSocket: (userId: string) => {},
  disconnectSocket: () => {},
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  function connectSocket(userId: string): void {
    if (!socket) {
      console.log("user connected:", userId);
      setSocket(() =>
        io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
          query: { userId },
        })
      );
    }
  }

  function disconnectSocket() {
    if (socket) {
      socket.disconnect();
      setSocket(() => null);
    }
  }

  /*export const socket = io(SOCKET_URL, {
      query: { userId }, // 可搭配 token 驗證也行
    });*/

  const contextValue = useMemo(
    () => ({
      socket,
      connectSocket,
      disconnectSocket,
    }),
    [socket]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
