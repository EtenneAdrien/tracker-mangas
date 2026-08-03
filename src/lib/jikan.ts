export type ResultatJikan = {
  mal_id: number
  titre: string
  image_url: string | null
  type: 'anime' | 'manga'
}

export async function rechercherTitres(
  recherche: string,
  type: 'anime' | 'manga'
): Promise<ResultatJikan[]> {
  const url = `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(recherche)}&limit=10`

  const reponse = await fetch(url)

  if (!reponse.ok) {
    throw new Error("Le service de recherche est momentanément indisponible.")
  }

  const json = await reponse.json()

  return json.data.map((item: any) => ({
    mal_id: item.mal_id,
    titre: item.title,
    image_url: item.images?.jpg?.image_url ?? null,
    type: type,
  }))
}