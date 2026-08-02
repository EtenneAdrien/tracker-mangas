import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [message, setMessage] = useState('')
  const [chargement, setChargement] = useState(false)

  async function inscription() {
    setChargement(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email: email,
      password: motDePasse,
    })

    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setMessage('Compte créé, tu peux te connecter.')
    }
    setChargement(false)
  }

  async function connexion() {
    setChargement(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: motDePasse,
    })

    if (error) {
      setMessage('Erreur : ' + error.message)
    }
    setChargement(false)
  }

  return (
    <div>
      <h1>Tracker Mangas</h1>
      <p>Connecte-toi pour accéder à ta liste.</p>

      <input
        type="email"
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />

      <button onClick={connexion} disabled={chargement}>
        Se connecter
      </button>

      <button onClick={inscription} disabled={chargement}>
        S'inscrire
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}