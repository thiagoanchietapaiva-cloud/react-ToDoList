import { useState } from 'react'
export default function Login({ mudarTela }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  async function logar(e) {
    e.preventDefault()
    try {
      const response = await fetch("https://js-lista-de-tarefas-api.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      })
      const json = await response.json()
      if (json.tipo == "warning") {
        alert(json.mensagem)
        return
      }
      sessionStorage.setItem("usuario", JSON.stringify(json.usuario))
      alert(json.mensagem)
      mudarTela('tarefas')
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className="bg-slate-200 h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded">
        <h1 className="text-3xl text-purple-900 font-bold mb-6">Seja bem-vindo à sua Lista de Tarefas!</h1>
        <form onSubmit={logar}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Digite seu e-mail:</label>
          <input 
            type="email" 
            placeholder="exemplo@email.com"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">Digite sua senha:</label>
          <input 
            type="password" 
            placeholder="********"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="button" onClick={() => mudarTela('cadastro')} className="my-5 text-purple-600 hover:underline block text-left">
            Cadastre-se
          </button>
          <button type="submit" className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}