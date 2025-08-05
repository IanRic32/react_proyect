import { useForm } from 'react-hook-form'

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <main className="flex flex-col items-center justify-center  bg-gray-100" style={{ padding: '1rem'}}>
      <section className="mb-4">
        <h1 className="text-2xl font-bold text-black">Bienvenido a CloneGPT</h1>
      </section>
      <div className="w-full max-w-xs"> {/* Contenedor más pequeño */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white rounded-lg shadow-md p-4" // Padding reducido
          style={{ minHeight: 'auto' }} // Altura automática
        >
          <div className="mb-3"> {/* Margen inferior reducido */}
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Este campo es requerido' })}
              className="shadow-sm border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              className="shadow-sm border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  )
}