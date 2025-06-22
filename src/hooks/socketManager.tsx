import { createContext, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext({
  socket: null,
  connectSocket: (userId: string) => {},
  disconnectSocket: () => {},
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  function connectSocket(userId: string): Socket {
    if (!socket) {
      setSocket(() =>
        io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
          query: { userId },
        })
      );
    }
    return socket;
  }

  function disconnectSocket() {
    if (socket) {
      socket.disconnect();
      setSocket(() => null);
    }
  }

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
