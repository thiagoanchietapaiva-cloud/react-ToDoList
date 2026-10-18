import { useState, useEffect } from 'react'
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

export default function Tarefas({ mudarTela }) {
    const [tarefas, setTarefas] = useState([])
    const [busca, setBusca] = useState('')

    const [mostrarCriar, setMostrarCriar] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [salvandoEdicao, setSalvandoEdicao] = useState(false)

    const [mostrarEditar, setMostrarEditar] = useState(false)
    const [idParaEditar, setIdParaEditar] = useState(null)
    const [tituloEditar, setTituloEditar] = useState('')
    const [descricaoEditar, setDescricaoEditar] = useState('')
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null")
    useEffect(() => {
        if (!usuario) {
            mudarTela('login')
            return
        }
        buscarTarefas()
    }, [])

    async function buscarTarefas() {
        const idDoUsuario = usuario.id || usuario._id
        try {
            const r = await fetch(`https://js-lista-de-tarefas-api.onrender.com/tarefas/${idDoUsuario}`)
            const json = await r.json()
            if (json.tipo === "erro") return console.log(json.mensagem)
            setTarefas(json.tarefas || json || [])
        } catch (e) {
            console.log(e)
        }
    }

    async function criarTarefa(e) {
        e.preventDefault()
        if (salvando) return
        setSalvando(true)
        const idDoUsuario = usuario.id || usuario._id
        try {
            const r = await fetch(`https://js-lista-de-tarefas-api.onrender.com/tarefas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: idDoUsuario, titulo, descricao })
            })
            const json = await r.json()
            if (json.tipo === "erro") return alert(json.mensagem)
            setMostrarCriar(false)
            setTitulo('')
            setDescricao('')
            buscarTarefas()
        } catch (err) {
            alert(err.message)
        } finally {
            setSalvando(false)
        }
    }
    function abrirFormEditar(id) {
        const t = tarefas.find(x => (x.id || x._id) == id)
        if (!t) return
        setIdParaEditar(id)
        setTituloEditar(t.titulo)
        setDescricaoEditar(t.descricao || '')
        setMostrarEditar(true)
    }

    async function editarTarefa(e) {
        e.preventDefault()
        if (salvandoEdicao) return
        setSalvandoEdicao(true)
        // ... seu fetch de PUT ...
        try {
            await fetch(`https://js-lista-de-tarefas-api.onrender.com/tarefas/${idParaEditar}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: tituloEditar, descricao: descricaoEditar })
            })
            setMostrarEditar(false)
            setIdParaEditar(null)
            buscarTarefas()
        } catch (err) {
            alert(err.message)
        } finally {
            setSalvandoEdicao(false)
        }
    }

    async function excluirTarefa(id) {
        if (!confirm("Excluir essa tarefa?")) return
        try {
            await fetch(`https://js-lista-de-tarefas-api.onrender.com/tarefas/${id}`, { method: 'DELETE' })
            buscarTarefas()
        } catch (err) {
            alert(err.message)
        }
    }
    const tarefasFiltradas = busca.length >= 3
        ? tarefas.filter(t => t.titulo.toLowerCase().includes(busca.toLowerCase()))
        : tarefas
    return (
        <div className="bg-slate-100 min-h-screen">
            <header className="flex justify-between items-center py-4 px-6 bg-purple-600 text-white sticky top-0">
                <div className='font-bold text-3xl mr-10'>To Do List</div>
                <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar tarefa..." className="flex-1 px-4 py-2 rounded bg-white text-gray-800" />
                <button onClick={() => setMostrarCriar(true)} className="ml-4 px-4 py-2 bg-purple-800 rounded hover:bg-purple-700">Adicionar</button>
            </header>
            <main className="p-6 min-h-[calc(100vh-72px)]">
                <h1 className="text-3xl text-purple-900 font-bold mb-6">Lista de Tarefas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tarefasFiltradas.length === 0 && <p className="text-gray-400">Nenhuma tarefa encontrada</p>}
                    {tarefasFiltradas.map(t => {
                        const idReal = t.id || t._id
                        return (
                            <div key={idReal} className="bg-white p-4 rounded-xl shadow max-w-full overflow-hidden">
                                <h3 className="font-bold text-purple-900 breakwords">{t.titulo}</h3>
                                <p className="text-sm text-gray-600 mt-1 break-all">{t.descricao || 'Sem descrição'}</p>
                                <div className="flex gap-2 mt-3">
                                 <button onClick={() => abrirFormEditar(idReal)} className="text-xl px-3 py-1 hover:text-purple-700 "><FaEdit /></button>
                                 <button onClick={() => excluirTarefa(idReal)} className="text-xl px-3 py-1 hover:text-red-500"><FaTrashAlt /></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>

            {mostrarCriar && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setMostrarCriar(false)}>
                    <form onSubmit={criarTarefa} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-purple-900 mb-4">Nova Tarefa</h2>
                        <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" className="w-full mb-4 px-4 py-2 rounded-xl border" required />
                        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" rows="4" className="w-full mb-6 px-4 py-2 rounded-xl border"></textarea>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setMostrarCriar(false)} className="px-5 py-2 rounded-xl bg-gray-100">Cancelar</button>
                            <button type="submit" disabled={salvando} className={`px-5 py-2 rounded-xl text-white ${salvando ? 'bg-gray-400' : 'bg-purple-600'}`}>
                                {salvando ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {mostrarEditar && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setMostrarEditar(false)}>
                    <form onSubmit={editarTarefa} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-purple-900 mb-4">Editar Tarefa</h2>
                        <input value={tituloEditar} onChange={e => setTituloEditar(e.target.value)} className="w-full mb-4 px-4 py-2 rounded-xl border" required />
                        <textarea value={descricaoEditar} onChange={e => setDescricaoEditar(e.target.value)} rows="4" className="w-full mb-6 px-4 py-2 rounded-xl border"></textarea>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setMostrarEditar(false)} className="px-5 py-2 rounded-xl bg-gray-100">Cancelar</button>
                            <button type="submit" disabled={salvandoEdicao} className={`px-5 py-2 rounded-xl text-white ${salvandoEdicao ? 'bg-gray-400' : 'bg-purple-600'}`}>
                                {salvandoEdicao ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}