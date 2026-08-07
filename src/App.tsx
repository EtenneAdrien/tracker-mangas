import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Recherche from './components/Recherche'
import MaListe from './components/MaListe'
import './App.css'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [chargement, setChargement] = useState(true)
  const [rafraichir, setRafraichir] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChargement(false)
    })

    const { data: ecouteur } = supabase.auth.onAuthStateChange(
      (_evenement, nouvelleSession) => {
        setSession(nouvelleSession)
      }
    )

    return () => ecouteur.subscription.unsubscribe()
  }, [])

  async function deconnexion() {
    await supabase.auth.signOut()
  }

  if (chargement) {
    return <p>Chargement...</p>
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div>
      <h1>Tracker Mangas</h1>
      <p>Connecté en tant que {session.user.email}</p>
      <button onClick={deconnexion}>Se déconnecter</button>
      <Recherche onAjout={() => setRafraichir(rafraichir + 1)} />
      <MaListe rafraichir={rafraichir} />
    </div>
  )
}