import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/auth'
import Recherche from './components/Recherche'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [chargement, setChargement] = useState(true)

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
      <Recherche />
    </div>
  )
}