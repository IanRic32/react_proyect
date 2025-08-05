import Form from './components/Form'
import './App.css'
export default function App() {
  return (
    <div className="inicio">
      <div className="container mx-auto" style={{ maxWidth: '800px' }}>
                <Form />
      </div>
    </div>
  )
}

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import './App.css'
// // Esquema de validación
// const messageSchema = z.object({
//   message: z.string()
//     .min(3, "El mensaje debe tener al menos 3 caracteres")
//     .max(200, "El mensaje no puede exceder los 200 caracteres")
// });

// export default function Form({ onSubmit }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm({
//     resolver: zodResolver(messageSchema)
//   });

//   const handleFormSubmit = (data) => {
//     onSubmit(data.message);
//     reset();
//   };

//   return (
//     <form 
//       onSubmit={handleSubmit(handleFormSubmit)}
//       className="p-4 bg-gray-800 border-t border-gray-700"
//     >
//       <div className="flex items-center gap-2">
//         <div className="flex-1 relative">
//           <input
//             type="text"
//             placeholder="Escribe tu mensaje..."
//             className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             {...register("message")}
//           />
//           {errors.message && (
//             <p className="absolute -bottom-6 left-0 text-red-400 text-sm">
//               {errors.message.message}
//             </p>
//           )}
//         </div>
//         <button
//           type="submit"
//           className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//           aria-label="Enviar mensaje"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <line x1="22" y1="2" x2="11" y2="13"></line>
//             <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//           </svg>
//         </button>
//       </div>
//     </form>
//   );
// }