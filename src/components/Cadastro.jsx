import { useState } from 'react'
export default function Cadastro({ mudarTela }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  async function cadastrar(e) {
    e.preventDefault()
    try {
      const res = await fetch("https://js-lista-de-tarefas-api.onrender.com/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      })
      const json = await res.json()
      if (json.tipo == "erro") {
        alert(json.mensagem)
        return
      }
      alert(json.mensagem)
      mudarTela('login')
    } catch (err) {
      alert(err.message)
    }
  }
  return (
    <div className="bg-slate-200 h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-96">
        <button onClick={() => mudarTela('login')} className="my-5 text-purple-600 hover:underline">Voltar</button>
        <h1 className="text-3xl text-purple-900 font-bold mb-6">Cadastro</h1>
        <form onSubmit={cadastrar} className="flex flex-col">
          <label className="text-sm font-semibold mb-2">Nome</label>
          <input className="px-4 py-2 border rounded-xl mb-4" value={nome} onChange={e => setNome(e.target.value)} required />
          <label className="text-sm font-semibold mb-2">E-mail</label>
          <input type="email" className="px-4 py-2 border rounded-xl mb-4" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="text-sm font-semibold mb-2">Senha</label>
          <input type="password" className="px-4 py-2 border rounded-xl mb-6" value={senha} onChange={e => setSenha(e.target.value)} required />
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}