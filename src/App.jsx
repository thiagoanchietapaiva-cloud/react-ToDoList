import { useState } from 'react'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import Tarefas from './components/Tarefas'


function App() {
  const [tela, setTela] = useState('login')
  return (
    <>
      {tela === 'login' && <Login mudarTela={setTela} />}
      {tela === 'cadastro' && <Cadastro mudarTela={setTela} />}
      {tela === 'tarefas' && <Tarefas mudarTela={setTela} />}
    </>
  )
}
export default App