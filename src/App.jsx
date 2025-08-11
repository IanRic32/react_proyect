import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { useGlobal } from "./context/globalContext"; // Cambiado a import named
import useOllamaHook from "./api/useOllamHook.jsx";

const messageSchema = z.object({
  text: z
    .string()
    .min(3, "El mensaje debe tener al menos 3 caracteres")
    .max(200, "El mensaje es demasiado largo"),
});

export default function App() {
  const { dispatch } = useGlobal();
  const ollama = useOllamaHook();
  const [messages, setMessages] = useState([]);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = (data) => {
    const newUserMessage = { text: data.text, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    reset();
    ollama.handleSubmit(data.text);
  };

  useEffect(() => {
    if (!ollama.response) return;
    
    setMessages(prev => {
      if (prev.length === 0 || prev[prev.length - 1].sender === "user") {
        return [...prev, { text: ollama.response, sender: "bot" }];
      }
      
      const lastMessage = prev[prev.length - 1];
      return [
        ...prev.slice(0, -1),
        { ...lastMessage, text: ollama.response }
      ];
    });
  }, [ollama.response]);

  useEffect(() => {
    if (messages.length > 0) {
      dispatch({ type: "@current_chat", payload: messages });
    }
  }, [messages, dispatch]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-700 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            {...register("text")}
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 rounded"
            disabled={ollama.loading}
          >
            {ollama.loading ? "..." : <SendHorizontal size={20} />}
          </button>
        </div>
        {errors.text && (
          <span className="text-red-400 text-sm">{errors.text.message}</span>
        )}
      </form>
    </div>
  );
}



// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SendHorizontal } from "lucide-react";
// import useGlobal from "./context/useGlobal.jsx";
// import useOllamaHook from "./api/useOllamHook.jsx";


// const messageSchema = z.object({
//   text: z
//     .string()
//     .min(3, "El mensaje debe tener al menos 3 caracteres")
//     .max(200, "El mensaje es demasiado largo"),
// });

// export default function App() {
//   const hook = useGlobal();
//   const ollama = useOllamaHook();
//   const [messages, setMessages] = useState([]);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(messageSchema),
//   });

//   const onSubmit = (data) => {
//     const newUserMessage = { text: data.text, sender: "user" };
//     setMessages((prev) => [...prev, newUserMessage]);
//     reset();
//     ollama.handleSubmit(data.text);
//   };

//   useEffect(() => {
//   if (!ollama.response) {return;}
  
//   setMessages(prev => {
//     // Si no hay mensajes del bot o el último mensaje es del usuario
//     if (prev.length === 0 || prev[prev.length - 1].sender === "user") {
//       return [...prev, { text: ollama.response, sender: "bot" }];
//     }
    
//     // Actualiza el último mensaje del bot
//     const lastMessage = prev[prev.length - 1];
//     return [
//       ...prev.slice(0, -1),
//       { ...lastMessage, text: ollama.response }
//     ];
//   });
// }, [ollama.response]);


//   useEffect(() => {
//     if (!messages.length) {return;}
//     const event= {type: "@current_chat", payload: messages };
//     hook.dispatch(event);
//   }, [messages, hook]);



 
//   return (
//     <div style={{ 
//       display: "flex",
//       flexDirection: "column",
//       height: "100vh",
//       width: "75vw",
//       backgroundColor: "#1a202c",
//       color: "white",
//       borderRadius: "16px",
//       padding: "16px",
//       margin: "0 auto",
//       boxSizing: "border-box",
//       overflow: "hidden"
//     }}>
//       {/* Área de mensajes */}
//       <div style={{ 
//         flex: 1,
//         overflowY: "auto",
//         padding: "16px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//         backgroundColor: "#2d3748",
//         borderRadius: "12px",
//         marginBottom: "16px"
//       }}>
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             style={{
//               padding: "12px 16px",
//               borderRadius: "12px",
//               maxWidth: "80%",
//               wordBreak: "break-word",
//               ...(msg.sender === "user"
//                 ? { 
//                     backgroundColor: "#3182ce",
//                     alignSelf: "flex-end",
//                     borderBottomRightRadius: "4px"
//                   }
//                 : { 
//                     backgroundColor: "#4a5568",
//                     alignSelf: "flex-start",
//                     borderBottomLeftRadius: "4px"
//                   })
//             }}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       {/* Formulario de envío - Contenedor centrado */}
//       <div style={{
//         justifyContent: "center",
//         width: "100%"
//       }}>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "8px",
//             width: "100%",

//             maxWidth: "800px" // Puedes ajustar este valor según necesites
//           }}
//         >
//           <div style={{ display: "flex", gap: "8px" , alignItems: "center", maxWidth: "100%"}}>
//             <input
//               type="text"
//               placeholder="Escribe un mensaje..."
//               style={{
//                 flex: 1,
//                 padding: "12px 16px",
//                 borderRadius: "8px",
//                 backgroundColor: "#2d3748",
//                 border: "1px solid #4a5568",
//                 color: "white",
//                 outline: "none",
//                 fontSize: "16px"
//               }}
//               {...register("text")}
//             />
//             <button
//               type="submit"
//               style={{
//                 padding: "12px 16px",
//                 backgroundColor: "#3182ce",
//                 borderRadius: "8px",
//                 color: "white",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center"
//               }}
//             >
//              {ollama.loading ? 0.7: <SendHorizontal size={20} />}
//             </button>
//           </div>
//           {errors.text && (
//             <span style={{ color: "#fc8181", fontSize: "14px", textAlign: "center" }}>
//               {errors.text.message}
//             </span>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }



// // import { useState, useEffect } from "react";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { SendHorizontal } from "lucide-react";
// // import { useGlobal } from "./context/contextoGlobal";
// // import useOllamaHook from "./api/useOllamHook";

// // const messageSchema = z.object({
// //   text: z
// //     .string()
// //     .min(3, "El mensaje debe tener al menos 3 caracteres")
// //     .max(200, "El mensaje es demasiado largo"),
// // });

// // export default function App() {
// //   const { dispatch } = useGlobal();
// //   const ollamaHook = useOllamaHook();
// //   const [messages, setMessages] = useState([]);

// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     formState: { errors },
// //   } = useForm({
// //     resolver: zodResolver(messageSchema),
// //   });

// //   const onSubmit = (data) => {
// //     const newUserMessage = { text: data.text, sender: "user" };
// //     setMessages((prev) => [...prev, newUserMessage]);
// //     reset();

// //     // Inicia el mensaje del bot antes de la respuesta
// //     setMessages(prev => [...prev, { text: "", sender: "bot" }]);
    
// //     ollamaHook.handleSubmit(data.text);
// //   };

// //   useEffect(() => {
// //     if (!ollamaHook.response) return;

// //     setMessages((prevMessages) => {
// //       const updatedMessages = [...prevMessages];
// //       const lastBotIndex = updatedMessages.findLastIndex(
// //         (msg) => msg.sender === "bot"
// //       );

// //       if (lastBotIndex !== -1) {
// //         updatedMessages[lastBotIndex] = {
// //           ...updatedMessages[lastBotIndex],
// //           text: ollamaHook.response,
// //         };
// //       } else {
// //         updatedMessages.push({ text: ollamaHook.response, sender: "bot" });
// //       }

// //       return updatedMessages;
// //     });
// //   }, [ollamaHook.response]);

// //   useEffect(() => {
// //     if (messages.length > 0) {
// //       dispatch({ type: "@current_chat", payload: messages });
// //     }
// //   }, [messages, dispatch]);

// //   return (
// //     <div className="flex flex-col h-screen w-full bg-gray-900 text-white justify-end">
// //       <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
// //         {messages.map((msg, index) => (
// //           <div
// //             key={index}
// //             className={`px-4 py-2 rounded-lg ${
// //               msg.sender === "user"
// //                 ? "bg-blue-600 self-end"
// //                 : "bg-gray-700 self-start mt-2"
// //             }`}
// //           >
// //             {msg.text}
// //             {ollamaHook.loading && 
// //               msg.sender === "bot" && 
// //               index === messages.length - 1 && 
// //               msg.text === "" && (
// //               <span className="ml-2 animate-pulse">...</span>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //       <form
// //         onSubmit={handleSubmit(onSubmit)}
// //         className="p-4 flex flex-col bg-gray-800 space-y-2"
// //       >
// //         <div className="flex items-center">
// //           <input
// //             type="text"
// //             placeholder="Escribe un mensaje..."
// //             className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
// //             {...register("text")}
// //           />
// //           <button
// //             type="submit"
// //             className="ml-2 p-2 bg-blue-600 rounded-lg"
// //           >
// //             <SendHorizontal size={20} />
// //           </button>
// //         </div>
// //         {errors.text && (
// //           <span className="text-red-400 text-sm">{errors.text.message}</span>
// //         )}
// //       </form>
// //     </div>
// //   );
// // }


// // useEffect(()=>{
// //     if (!ollama.response) return;

// //     setMessages(prevMessages => {
// //       const updatedMessages = [...prevMessages];
// //       const lastBotIndex = [...updatedMessages]
// //       .reverse()
// //       .findIndex(msg => msg.sender === "bot");

// //       if (lastBotIndex !== -1) {
// //         const realIndex = updatedMessages.length - 1 - lastBotIndex;
// //         updatedMessages[realIndex] = {
// //           ...updatedMessages[realIndex],
// //           text: ollama.response,
// //         };
// //       } else {
// //         updatedMessages.push({ text: ollama.response, sender: "bot" });
// //       }
// //       return updatedMessages;
// //     });
// //   }, [ollama.response]);